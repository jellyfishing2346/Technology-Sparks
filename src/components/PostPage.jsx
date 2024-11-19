import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabaseClient';
import LoadingSpinner from './LoadingSpinner';
import { ThemeContext } from '../contexts/ThemeContext';
import { UserContext } from '../contexts/UserContext';

function PostPage() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);
  const { userId } = useContext(UserContext);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  async function fetchPost() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setPost(data);
      setEditedTitle(data.title);
      setEditedContent(data.content);
    } catch (error) {
      console.error('Error fetching post:', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchComments() {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error.message);
    }
  }

  async function handleUpvote() {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ upvotes: (post.upvotes || 0) + 1 })
        .eq('id', id);

      if (error) throw error;

      setPost({ ...post, upvotes: (post.upvotes || 0) + 1 });
    } catch (error) {
      console.error('Error upvoting:', error.message);
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: id, content: newComment, user_id: userId }])
        .select('*');

      if (error) throw error;

      setComments([...comments, ...data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error.message);
    }
  }

  async function handleDelete() {
    console.log("secret key", post.secret_key);
    if (post.secret_key === null || post.secret_key === '') {
      const confirmDelete = window.confirm(
        "This post has no secret key. Are you sure you want to delete it?"
      );
      if (!confirmDelete) return;
    } else if (secretKey !== post.secret_key) {
      alert('Incorrect secret key');
      return;
    }

    try {
      await supabase.from('comments').delete().eq('post_id', id);

      const { error } = await supabase.from('posts').delete().eq('id', id);

      if (error) throw error;

      alert('Post deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error.message);
      alert('Failed to delete post. Please try again.');
    }
  }

  async function handleEdit() {
    if (post.secret_key === null || post.secret_key === '') {
      const confirmEdit = window.confirm(
        "This post has no secret key. Are you sure you want to edit it?"
      );
      if (!confirmEdit) return;
    } else if (secretKey !== post.secret_key) {
      alert('Incorrect secret key');
      return;
    }

    try {
      const { error } = await supabase
        .from('posts')
        .update({ title: editedTitle, content: editedContent })
        .eq('id', id);

      if (error) throw error;

      setPost({ ...post, title: editedTitle, content: editedContent });
      setIsEditing(false);
      alert('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error.message);
      alert('Failed to update post. Please try again.');
    }
  }

  async function handleRepost() {
    const newSecretKey = prompt("Please enter a new secret key for the repost:");
    if (!newSecretKey) return;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title: `Repost: ${post.title}`,
            content: post.content,
            image_url: post.image_url,
            video_url: post.video_url,
            user_id: userId,
            original_post_id: post.id,
            secret_key: newSecretKey,
          },
        ])
        .select();

      if (error) throw error;

      alert('Post reposted successfully!');
      navigate(`/post/${data[0].id}`);
    } catch (error) {
      console.error('Error reposting:', error.message);
      alert('Failed to repost. Please try again.');
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(comments.filter((comment) => comment.id !== commentId));
      alert('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error.message);
      alert('Failed to delete comment. Please try again.');
    }
  }

  async function handleSecretKey() {
    if (post.secret_key) {
      alert('This post already has a secret key.');
      return;
    }

    const newSecretKey = prompt("Please enter a new secret key for this post:");
    if (!newSecretKey) return;

    try {
      const { error } = await supabase
        .from('posts')
        .update({ secret_key: newSecretKey })
        .eq('id', post.id);

      if (error) throw error;

      alert('Secret key set successfully!');
      fetchPost(); // Refresh the post data
    } catch (error) {
      console.error('Error setting secret key:', error);
      alert('Failed to set secret key. Please try again.');
    }
  }

  if (isLoading) return <LoadingSpinner />;
  if (!post) return <div>Post not found</div>;

  return (
    <div className={`post-page ${theme}`}>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter secret key to edit"
          />
          <button onClick={handleEdit}>Save Changes</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          {post.image_url && <img src={post.image_url} alt={post.title} />}
          {post.video_url && (
            <iframe
              width="560"
              height="315"
              src={post.video_url}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
          <p>Upvotes: {post.upvotes || 0}</p>
          <button onClick={handleUpvote}>Upvote</button>
          <button onClick={() => setIsEditing(true)}>Edit Post</button>
          <button onClick={handleDelete}>Delete Post</button>
          <button onClick={handleRepost}>Repost</button>
          {!post.secret_key && <button onClick={handleSecretKey}>Set Secret Key</button>}
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter secret key for actions"
          />
        </div>
      )}

      <h2>Comments</h2>
      <form onSubmit={handleAddComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          required
        />
        <button type="submit">Post Comment</button>
      </form>

      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default PostPage;

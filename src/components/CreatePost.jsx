import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabaseClient';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const finalImageUrl = imageUrl;

    // If secretKey is not provided, generate one
    const generatedKey = secretKey || generateSecretKey();

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            content,
            image_url: finalImageUrl,
            upvotes: 0,
            secret_key: generatedKey,
          },
        ])
        .select();

      if (error) throw error;

      console.log('Post created:', data);
      alert('Post created successfully!');
      navigate(`/post/${data[0].id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSecretKey = () => {
    return Math.random().toString(36).substr(2, 8);
  };

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      <h1>Create New Post</h1>
      <form onSubmit={handleSubmit} className="create-post-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content (optional)"
        />
        <div>
          <label>Enter Image URL:</label>
          <input
            type="text"
            value={imageUrl}
            onChange={handleImageUrlChange}
            placeholder="Image URL"
          />
        </div>
        <input
          type="text"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          placeholder="Secret Key (optional)"
        />
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;

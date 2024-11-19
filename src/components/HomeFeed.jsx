import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './utils/supabaseClient';

function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('created_at');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [sortBy, searchQuery]);

  async function fetchPosts() {
    let query = supabase
      .from('posts')
      .select('*')
      .order(sortBy, { ascending: false });

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) console.error('Error fetching posts:', error);
    else setPosts(data);
  }

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="home-feed">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search posts"
      />
      <select onChange={(e) => setSortBy(e.target.value)}>
        <option value="created_at">Sort by Date</option>
        <option value="upvotes">Sort by Upvotes</option>
      </select>
      {posts.map(post => (
        <div key={post.id} className="post-card" onClick={() => handlePostClick(post.id)}>
          <h2>{post.title}</h2>
          <p>Created at: {new Date(post.created_at).toLocaleString()}</p>
          <p>Upvotes: {post.upvotes}</p>
        </div>
      ))}
    </div>
  );
}

export default HomeFeed;

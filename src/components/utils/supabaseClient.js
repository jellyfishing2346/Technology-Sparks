import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://thelbmysfsdfgszjifsx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZWxibXlzZnNkZmdzemppZnN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNzc0MDEsImV4cCI6MjA0Njc1MzQwMX0.xgHRqfE9h48efUkib6tHutqL1l1afYoZfr-h9bkebBQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createPost(postData) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Error retrieving user:', authError?.message || 'No user logged in');
    return;
  }

  const { error } = await supabase
    .from('posts')
    .insert({
      title: postData.title,         // Post title
      content: postData.content,     // Post content
      image_url: postData.imageUrl,  // Image URL
      user_id: user.id,              // Authenticated user's UUID
    });

  if (error) {
    console.error('Error inserting post:', error.message);
  } else {
    console.log('Post created successfully!');
  }
}
createPost()
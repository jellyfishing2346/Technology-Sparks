# Final Project: HobbyHub

## Overview

What is your passion? What topic do you always love to learn more about and can't wait to share with everyone else? In this project, you will be building an entire forum surrounding your favorite topic, be it a sport, an academic subject, or a video game! Your web app will allow users to create posts and see a feed of them on the home page, edit, delete, or leave comments underneath them for discussions, and give upvotes for posts that you like! Take full creative control over the look and feel of the web app, and make sure to employ the web design principles that you learned! Ultimately, you will create an awesome forum for an online community for people who share your hobby!

This will be a two-week project and will be due before Week 10, Demo Day!

## Required Features

- **A create form that allows the user to create posts**  
  Posts must contain a title, and optionally additional textual content and/or an image added as an external image URL.

- **A home feed displaying previously created posts**  
  By default, only the time created, title, and upvotes count for each post is shown on the posts feed.  
  Clicking on a post shall direct the user to a new page for the selected post.

- **Sorting and searching features**  
  Users can sort posts by either their created time or upvotes count.  
  Users can search for posts by title.

- **A separate post page for each created post**  
  The post page should display any additional information, including content, image, and comments.

- **Comment functionality**  
  Users can leave comments underneath a post on the post page.

- **Upvote button on the post page**  
  Each post should have an upvote button on the post page. Each click increases its upvotes count by one.  
  Users can upvote any post any number of times, but not downvote.

- **Edit and Delete Post Features**  
  A previously created post can be edited from its post page.  
  A previously created post can be deleted from its post page.

## Screenshot

- **Home Feed**: Screenshot of app with core features implemented.
- **Create a New Post**: Screenshot of app with core features implemented.
- **Post Page**: Screenshot of app with core features implemented.
- **Update A Post**: Screenshot of app with core features implemented.

## Stretch Features

- **Secret Key for Editing and Deleting Posts**  
  Users can only edit and delete posts or delete comments by entering the secret key, which is set by the user during post creation.

- **Random User ID**  
  Upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them.

- **Reposting Feature**  
  Users can repost a previous post by referencing its post ID. On the post page of the new post, the referenced post is displayed and linked, creating a thread.

- **Interface Customization**  
  Users can customize the interface, e.g., selecting the color scheme or showing the content and image of each post on the home feed.

- **Web Video Sharing**  
  Users can share and view web videos.

- **Post Flags**  
  Users can set flags such as "Question" or "Opinion" while creating a post. Then, users can filter posts by flags on the home feed.

- **Direct Image Upload**  
  Users can upload images directly from their local machine as an image file.

- **Loading Animation**  
  Display a loading animation whenever data is being fetched.

## Resources

- [Supabase Home Page](https://supabase.io)
- [Supabase Docs for Databases](https://supabase.io/docs/guides/database)
- [supabase-js Docs](https://supabase.io/docs/reference/javascript)
- [How To Load a JSON File in React](https://reactjs.org/docs/importing-and-exporting-components.html)

## 💡 Hints

### Help! I don't know where to start!

As always, a good starting place would be to set up the basic layout for your app. Try using the provided data (save as JSON to your computer) to display a list of posts and group them into cards!  
Look at the past weeks' lab and projects for examples on how to implement similar features. What code will be similar? What do you need to change?

### I'm stuck on something!

Don't just skip the Resources section!  
Still need a little extra help getting started or running into an error? Try posting in the Class Slack Channel.

### What if I want to add more attributes to posts later on?

No problem! From the Supabase projects dashboard, you can easily add more columns to your table and also edit your older rows to add some values in those newer columns as well!

### I tried to make an API request to my database, but nothing happened!

This may have happened because your API request was missing something:
- With adding to the table, make sure that every column that doesn't have a default value has something in it.
- With updating and deleting, make sure that there is some sort of ID or distinct value that you can match on within the table so that your database knows what exactly to get rid of or change.  
Make sure you uncheck the "Enable Row Level Security (RLS)" option for your table in the database!

### How do I sort the posts in the home feed? Should I write a function to sort the posts array?

Link to Loom video: https://www.loom.com/share/3e2505eb33114e999b299bcad1bee528

You can do so by defining a state variable `orderBy` which specifies which column in the table to sort by, then passing it into your API fetch request like so:
```javascript
supabase.from("posts").select().order(orderBy, { ascending: false });



Copyright

© 2024 Faizan Khan. All rights reserved.

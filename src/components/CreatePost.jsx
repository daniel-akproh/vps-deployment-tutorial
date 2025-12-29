import { useState } from 'react';

function CreatePost({ onCreatePost }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !author.trim()) {
      alert('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    const success = await onCreatePost({ title, content, author });
    setIsSubmitting(false);

    if (success) {
      // Clear form on success
      setTitle('');
      setContent('');
      setAuthor('');
    }
  };

  return (
    <div className="card">
      <h3>➕ Create New Blog Post</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            disabled={isSubmitting}
          />
        </div>
        <div className="row">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog post content..."
            disabled={isSubmitting}
          />
        </div>
        <div className="row">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            disabled={isSubmitting}
          />
        </div>
        <div className="row">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;

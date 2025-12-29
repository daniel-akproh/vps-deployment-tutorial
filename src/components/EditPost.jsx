import { useState, useEffect } from 'react';

function EditPost({ post, onUpdatePost, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setAuthor(post.author);
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !author.trim()) {
      alert('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    const postId = post._id || post.id;
    await onUpdatePost(postId, { title, content, author });
    setIsSubmitting(false);
  };

  return (
    <div className="card" id="editCard">
      <h3>✏️ Edit Post</h3>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="editTitle">Title</label>
          <input
            type="text"
            id="editTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="row">
          <label htmlFor="editContent">Content</label>
          <textarea
            id="editContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="row">
          <label htmlFor="editAuthor">Author</label>
          <input
            type="text"
            id="editAuthor"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="row">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            className="secondary" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;

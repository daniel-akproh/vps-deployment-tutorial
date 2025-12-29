function PostItem({ post, onEdit, onDelete }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="post-item">
      <h4>{post.title}</h4>
      <div className="post-meta">
        By {post.author} | Created: {formatDate(post.created_at)}
      </div>
      <div className="post-content">{post.content}</div>
      <div className="post-actions">
        <button className="secondary" onClick={onEdit}>
          Edit
        </button>
        <button className="danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default PostItem;

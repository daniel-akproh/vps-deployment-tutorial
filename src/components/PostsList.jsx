import PostItem from './PostItem';

function PostsList({ posts, loading, onEditClick, onDeletePost, onRefresh }) {
  if (loading) {
    return (
      <div className="card">
        <h3>📖 All Blog Posts</h3>
        <p className="empty-state">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>📖 All Blog Posts</h3>
      <button onClick={onRefresh}>Refresh Posts</button>
      
      {posts.length === 0 ? (
        <p className="empty-state">No posts yet. Create one above!</p>
      ) : (
        <div>
          {posts.map((post) => {
            const postId = post._id || post.id;
            return (
              <PostItem
                key={postId}
                post={post}
                onEdit={() => onEditClick(post)}
                onDelete={() => onDeletePost(postId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PostsList;

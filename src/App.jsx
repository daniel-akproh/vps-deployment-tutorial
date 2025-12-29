import { useState, useEffect } from 'react';
import CreatePost from './components/CreatePost';
import PostsList from './components/PostsList';
import EditPost from './components/EditPost';
import HealthCheck from './components/HealthCheck';
import StatusMessage from './components/StatusMessage';
import { fetchPosts, createPost, updatePost, deletePost } from './api';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [status, setStatus] = useState({ message: '', type: '' });

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await fetchPosts();
      setPosts(data.posts);
    } catch (error) {
      showStatus(`Error loading posts: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const data = await createPost(postData);
      // Add the new post to the beginning of the list for real-time display
      setPosts([data.post, ...posts]);
      showStatus('✅ Post created successfully!', 'success');
      return true;
    } catch (error) {
      showStatus(`❌ Error: ${error.message}`, 'error');
      return false;
    }
  };

  const handleUpdatePost = async (id, postData) => {
    try {
      const data = await updatePost(id, postData);
      // Update the post in the list for real-time display
      setPosts(posts.map(post => {
        const postId = post._id || post.id;
        return postId === id ? data.post : post;
      }));
      setEditingPost(null);
      showStatus('✅ Post updated successfully!', 'success');
      return true;
    } catch (error) {
      showStatus(`❌ Error: ${error.message}`, 'error');
      return false;
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await deletePost(id);
      // Remove the post from the list for real-time display
      setPosts(posts.filter(post => {
        const postId = post._id || post.id;
        return postId !== id;
      }));
      showStatus('✅ Post deleted successfully!', 'success');
    } catch (error) {
      showStatus(`❌ Error: ${error.message}`, 'error');
    }
  };

  const handleEditClick = (post) => {
    setEditingPost(post);
    // Scroll to edit form
    setTimeout(() => {
      document.getElementById('editCard')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const showStatus = (message, type) => {
    setStatus({ message, type });
    setTimeout(() => {
      setStatus({ message: '', type: '' });
    }, 4000);
  };

  return (
    <div>
      <h1>📝 Blog CRUD Demo</h1>
      <p>Test full CRUD operations (Create, Read, Update, Delete) with MongoDB on your VPS.</p>
      
      <StatusMessage message={status.message} type={status.type} />

      <CreatePost onCreatePost={handleCreatePost} />

      <PostsList 
        posts={posts}
        loading={loading}
        onEditClick={handleEditClick}
        onDeletePost={handleDeletePost}
        onRefresh={loadPosts}
      />

      {editingPost && (
        <EditPost
          post={editingPost}
          onUpdatePost={handleUpdatePost}
          onCancel={handleCancelEdit}
        />
      )}

      <HealthCheck />
    </div>
  );
}

export default App;

// API Configuration
const API_URL = 'http://localhost:3000/api';

// API Helper Functions
const API = {
    // Get all posts with optional filters
    getPosts: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const response = await fetch(`${API_URL}/posts?${queryParams}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },

    // Get single post by ID
    getPostById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/posts/${id}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching post:', error);
            throw error;
        }
    },

    // Get single post by slug
    getPostBySlug: async (slug) => {
        try {
            const response = await fetch(`${API_URL}/posts/slug/${slug}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching post:', error);
            throw error;
        }
    },

    // Create new post
    createPost: async (postData) => {
        try {
            const response = await fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },

    // Update post
    updatePost: async (id, postData) => {
        try {
            const response = await fetch(`${API_URL}/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    },

    // Delete post
    deletePost: async (id) => {
        try {
            const response = await fetch(`${API_URL}/posts/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    },

    // Like post
    likePost: async (id) => {
        try {
            const response = await fetch(`${API_URL}/posts/${id}/like`, {
                method: 'PATCH'
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error liking post:', error);
            throw error;
        }
    }
};

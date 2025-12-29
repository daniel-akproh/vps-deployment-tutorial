import 'dotenv/config';
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Config ---
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || ''; // empty = in-memory fallback
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(express.json());

// Serve static files from React build in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
} else {
  // In development, public folder is used by Vite
  app.use(express.static('public'));
}

// --- In-memory fallback (if no DB yet) ---
let memPosts = [];
let memIdCounter = 1;

// --- MongoDB connection ---
let db = null;
let postsCollection = null;

if (MONGODB_URI) {
  const client = new MongoClient(MONGODB_URI);
  (async () => {
    try {
      await client.connect();
      db = client.db(); // Uses database from connection string
      postsCollection = db.collection('blog_posts');
      
      // Create indexes for better performance
      await postsCollection.createIndex({ created_at: -1 });
      
      console.log('MongoDB connected and ready');
    } catch (e) {
      console.error('MongoDB connection error:', e.message);
      db = null;
      postsCollection = null;
    }
  })();
}

// ========== BLOG CRUD API ENDPOINTS ==========

// CREATE: Add a new blog post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    if (!title || !content || !author) {
      return res.status(400).json({ ok: false, error: 'Title, content, and author are required' });
    }

    if (postsCollection) {
      const newPost = {
        title,
        content,
        author,
        created_at: new Date(),
        updated_at: new Date()
      };
      const result = await postsCollection.insertOne(newPost);
      newPost._id = result.insertedId;
      return res.json({ ok: true, post: newPost });
    } else {
      const newPost = {
        id: memIdCounter++,
        title,
        content,
        author,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      memPosts.push(newPost);
      return res.json({ ok: true, post: newPost });
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// READ: Get all blog posts
app.get('/api/posts', async (_req, res) => {
  try {
    if (postsCollection) {
      const posts = await postsCollection.find().sort({ created_at: -1 }).toArray();
      return res.json({ ok: true, posts });
    } else {
      return res.json({ ok: true, posts: memPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) });
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// READ: Get a single blog post by ID
app.get('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    if (postsCollection) {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ ok: false, error: 'Invalid post ID' });
      }
      const post = await postsCollection.findOne({ _id: new ObjectId(id) });
      if (!post) {
        return res.status(404).json({ ok: false, error: 'Post not found' });
      }
      return res.json({ ok: true, post });
    } else {
      const numId = parseInt(id);
      const post = memPosts.find(p => p.id === numId);
      if (!post) {
        return res.status(404).json({ ok: false, error: 'Post not found' });
      }
      return res.json({ ok: true, post });
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// UPDATE: Update an existing blog post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ ok: false, error: 'Title, content, and author are required' });
    }

    if (postsCollection) {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ ok: false, error: 'Invalid post ID' });
      }
      const result = await postsCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { title, content, author, updated_at: new Date() } },
        { returnDocument: 'after' }
      );
      if (!result) {
        return res.status(404).json({ ok: false, error: 'Post not found' });
      }
      return res.json({ ok: true, post: result });
    } else {
      const numId = parseInt(id);
      const postIndex = memPosts.findIndex(p => p.id === numId);
      if (postIndex === -1) {
        return res.status(404).json({ ok: false, error: 'Post not found' });
      }
      memPosts[postIndex] = {
        ...memPosts[postIndex],
        title,
        content,
        author,
        updated_at: new Date().toISOString()
      };
      return res.json({ ok: true, post: memPosts[postIndex] });
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// DELETE: Remove a blog post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (postsCollection) {
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ ok: false, error: 'Invalid post ID' });
      }
      const result = await postsCollection.findOneAndDelete({ _id: new ObjectId(id) });
      if (!result) {
        return res.status(404).json({ ok: false, error: 'Post not found' });
      }
      return res.json({ ok: true, message: 'Post deleted', post: result });
    } else {
      const numId = parseInt(id);
      const postIndex = memPosts.findIndex(p => p.id === numId);
      if (postIndex === -1) {
        return res.status(404).json({ ok: false, error: 'Post not found' });
      }
      const deletedPost = memPosts.splice(postIndex, 1)[0];
      return res.json({ ok: true, message: 'Post deleted', post: deletedPost });
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    if (postsCollection) {
      await db.admin().ping();
      const count = await postsCollection.countDocuments();
      res.json({ ok: true, db: 'MongoDB connected', totalPosts: count });
    } else {
      res.json({ ok: true, db: 'in-memory', totalPosts: memPosts.length });
    }
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Serve React app for all non-API routes in production
if (NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => console.log(`Blog API listening on ${PORT}`));











const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// @route   GET /api/posts
// @desc    Get all posts (with filtering and pagination)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { status, category, featured, page = 1, limit = 10 } = req.query;
        
        // Build query
        const query = {};
        if (status) query.status = status;
        if (category) query.category = category;
        if (featured) query['visibility.featured'] = featured === 'true';
        
        // Pagination
        const skip = (page - 1) * limit;
        
        const posts = await Post.find(query)
            .sort({ publishDate: -1 })
            .limit(parseInt(limit))
            .skip(skip);
        
        const total = await Post.countDocuments(query);
        
        res.json({
            success: true,
            data: posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching posts', 
            error: error.message 
        });
    }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: 'Post not found' 
            });
        }
        
        // Increment views
        post.views += 1;
        await post.save();
        
        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching post', 
            error: error.message 
        });
    }
});

// @route   GET /api/posts/slug/:slug
// @desc    Get single post by slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: 'Post not found' 
            });
        }
        
        // Increment views
        post.views += 1;
        await post.save();
        
        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching post', 
            error: error.message 
        });
    }
});

// @route   POST /api/posts
// @desc    Create new post
// @access  Private (Add authentication later)
router.post('/', async (req, res) => {
    try {
        const postData = {
            title: req.body.title,
            subtitle: req.body.subtitle,
            content: req.body.content,
            category: req.body.category,
            tags: req.body.tags || [],
            status: req.body.status || 'Draft',
            featuredImage: req.body.featuredImage,
            author: req.body.author || 'Sharon D.',
            publishDate: req.body.publishDate || Date.now(),
            scheduledDate: req.body.scheduledDate,
            slug: req.body.slug,
            seo: {
                metaTitle: req.body.metaTitle,
                metaDescription: req.body.metaDescription
            },
            visibility: {
                showOnHomepage: req.body.showOnHomepage !== undefined ? req.body.showOnHomepage : true,
                allowComments: req.body.allowComments !== undefined ? req.body.allowComments : true,
                featured: req.body.featured || false
            }
        };
        
        const post = new Post(postData);
        await post.save();
        
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: post
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: 'Error creating post', 
            error: error.message 
        });
    }
});

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private (Add authentication later)
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: 'Post not found' 
            });
        }
        
        // Update fields
        if (req.body.title) post.title = req.body.title;
        if (req.body.subtitle !== undefined) post.subtitle = req.body.subtitle;
        if (req.body.content) post.content = req.body.content;
        if (req.body.category) post.category = req.body.category;
        if (req.body.tags) post.tags = req.body.tags;
        if (req.body.status) post.status = req.body.status;
        if (req.body.featuredImage !== undefined) post.featuredImage = req.body.featuredImage;
        if (req.body.publishDate) post.publishDate = req.body.publishDate;
        if (req.body.scheduledDate) post.scheduledDate = req.body.scheduledDate;
        if (req.body.slug) post.slug = req.body.slug;
        
        if (req.body.metaTitle !== undefined || req.body.metaDescription !== undefined) {
            post.seo = {
                metaTitle: req.body.metaTitle || post.seo.metaTitle,
                metaDescription: req.body.metaDescription || post.seo.metaDescription
            };
        }
        
        if (req.body.showOnHomepage !== undefined || req.body.allowComments !== undefined || req.body.featured !== undefined) {
            post.visibility = {
                showOnHomepage: req.body.showOnHomepage !== undefined ? req.body.showOnHomepage : post.visibility.showOnHomepage,
                allowComments: req.body.allowComments !== undefined ? req.body.allowComments : post.visibility.allowComments,
                featured: req.body.featured !== undefined ? req.body.featured : post.visibility.featured
            };
        }
        
        await post.save();
        
        res.json({
            success: true,
            message: 'Post updated successfully',
            data: post
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            message: 'Error updating post', 
            error: error.message 
        });
    }
});

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private (Add authentication later)
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: 'Post not found' 
            });
        }
        
        await post.deleteOne();
        
        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting post', 
            error: error.message 
        });
    }
});

// @route   PATCH /api/posts/:id/like
// @desc    Like a post
// @access  Public
router.patch('/:id/like', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ 
                success: false, 
                message: 'Post not found' 
            });
        }
        
        post.likes += 1;
        await post.save();
        
        res.json({
            success: true,
            message: 'Post liked',
            likes: post.likes
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error liking post', 
            error: error.message 
        });
    }
});

module.exports = router;

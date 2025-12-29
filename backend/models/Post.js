const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    subtitle: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    category: {
        type: String,
        enum: ['Beauty', 'Wellness', 'Wisdom', 'Aging', 'Lifestyle'],
        default: 'Lifestyle'
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Scheduled'],
        default: 'Draft'
    },
    featuredImage: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        default: 'Sharon D.'
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    scheduledDate: {
        type: Date
    },
    slug: {
        type: String,
        trim: true
    },
    seo: {
        metaTitle: {
            type: String,
            maxlength: 60
        },
        metaDescription: {
            type: String,
            maxlength: 160
        }
    },
    visibility: {
        showOnHomepage: {
            type: Boolean,
            default: true
        },
        allowComments: {
            type: Boolean,
            default: true
        },
        featured: {
            type: Boolean,
            default: false
        }
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Generate slug from title before saving
postSchema.pre('save', function(next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }
    next();
});

// Index for faster queries
postSchema.index({ status: 1, publishDate: -1 });
postSchema.index({ slug: 1 });
postSchema.index({ category: 1 });

module.exports = mongoose.model('Post', postSchema);

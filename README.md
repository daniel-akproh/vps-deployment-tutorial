# SimplySharon Blog - MongoDB Backend

A modern blog platform with MongoDB integration for full CRUD operations.

## 🚀 Features

- ✅ Create, Read, Update, Delete blog posts
- ✅ Rich text editor with formatting options
- ✅ MongoDB database integration
- ✅ Category and tag management
- ✅ SEO optimization fields
- ✅ Featured images
- ✅ Draft and publish workflow
- ✅ Post analytics (views, likes)
- ✅ RESTful API

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Choose one option:
  - **Option 1: Local MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
  - **Option 2: MongoDB Atlas (Cloud)** - [Sign up here](https://www.mongodb.com/cloud/atlas/register)

## 🛠️ Installation Steps

### 1. Install Dependencies

Open terminal in the project folder and run:

```bash
npm install
```

This will install:

- Express.js (backend server)
- Mongoose (MongoDB ODM)
- CORS (cross-origin requests)
- Dotenv (environment variables)
- Multer (file uploads)

### 2. Configure MongoDB Connection

Open the `.env` file and update the MongoDB connection string:

#### For Local MongoDB:

```
MONGODB_URI=mongodb://localhost:27017/simplysharon
PORT=3000
```

#### For MongoDB Atlas (Cloud):

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `.env`:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/simplysharon?retryWrites=true&w=majority
PORT=3000
```

Replace `<username>` and `<password>` with your MongoDB Atlas credentials.

### 3. Start MongoDB (If using local MongoDB)

Make sure MongoDB is running on your machine:

**Windows:**

```bash
net start MongoDB
```

**macOS/Linux:**

```bash
sudo service mongod start
```

Or use MongoDB Compass to start MongoDB with a GUI.

### 4. Start the Server

Run the development server:

```bash
npm start
```

Or use nodemon for auto-restart on file changes:

```bash
npm run dev
```

You should see:

```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

### 5. Open the Application

Open your browser and go to:

```
http://localhost:3000
```

To create/edit posts:

```
http://localhost:3000/dashboard/post-editor.html
```

## 📁 Project Structure

```
SimplySharon/
│
├── backend/
│   ├── models/
│   │   └── Post.js              # MongoDB Post schema
│   ├── routes/
│   │   └── postRoutes.js        # API routes for CRUD operations
│   └── api.js                   # Frontend API helper
│
├── dashboard/
│   ├── post-editor.html         # Post creation/editing interface
│   ├── admin.html               # Admin dashboard
│   └── analytics.html           # Analytics page
│
├── blog/
│   └── blogcast.html            # Blog listing page
│
├── server.js                    # Express server
├── package.json                 # Dependencies
├── .env                         # Environment variables
└── README.md                    # This file
```

## 🔌 API Endpoints

### Posts

| Method | Endpoint                | Description                  |
| ------ | ----------------------- | ---------------------------- |
| GET    | `/api/posts`            | Get all posts (with filters) |
| GET    | `/api/posts/:id`        | Get post by ID               |
| GET    | `/api/posts/slug/:slug` | Get post by slug             |
| POST   | `/api/posts`            | Create new post              |
| PUT    | `/api/posts/:id`        | Update post                  |
| DELETE | `/api/posts/:id`        | Delete post                  |
| PATCH  | `/api/posts/:id/like`   | Like a post                  |

### Query Parameters for GET /api/posts

- `status` - Filter by status (Draft, Published, Scheduled)
- `category` - Filter by category
- `featured` - Filter featured posts (true/false)
- `page` - Page number (default: 1)
- `limit` - Posts per page (default: 10)

Example:

```
http://localhost:3000/api/posts?status=Published&category=Beauty&page=1&limit=10
```

## 📝 Usage Example

### Creating a Post via API

```javascript
// Using the API helper
const postData = {
  title: "My Amazing Post",
  subtitle: "A subtitle for context",
  content: "<p>This is the content of the post...</p>",
  category: "Beauty",
  tags: ["skincare", "wellness"],
  status: "Published",
  metaTitle: "SEO Title",
  metaDescription: "SEO description",
  showOnHomepage: true,
  allowComments: true,
  featured: false,
};

const response = await API.createPost(postData);
console.log(response);
```

### Fetching Posts

```javascript
// Get all published posts
const posts = await API.getPosts({ status: "Published" });

// Get a specific post
const post = await API.getPostById("post-id-here");

// Get post by slug
const post = await API.getPostBySlug("my-amazing-post");
```

## 🔧 MongoDB Schema

The Post model includes:

```javascript
{
  title: String (required),
  subtitle: String,
  content: String (required),
  category: String (enum: Beauty, Wellness, Wisdom, Aging, Lifestyle),
  tags: [String],
  status: String (enum: Draft, Published, Scheduled),
  featuredImage: String,
  author: String (default: "Sharon D."),
  publishDate: Date,
  slug: String (auto-generated from title),
  seo: {
    metaTitle: String (max 60 chars),
    metaDescription: String (max 160 chars)
  },
  visibility: {
    showOnHomepage: Boolean,
    allowComments: Boolean,
    featured: Boolean
  },
  views: Number,
  likes: Number,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🐛 Troubleshooting

### MongoDB Connection Error

**Error:** `MongoNetworkError: failed to connect to server`

**Solution:**

- Make sure MongoDB is running
- Check your connection string in `.env`
- For Atlas, check firewall/whitelist settings

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill
```

Or change the PORT in `.env` file.

### CORS Error

If you get CORS errors, make sure the server is running and you're accessing the frontend through `http://localhost:3000`, not by opening the HTML file directly.

## 📚 Next Steps

To enhance this project, consider:

1. **Authentication & Authorization** - Add user login/authentication
2. **Image Upload** - Implement proper image upload to cloud storage (Cloudinary, AWS S3)
3. **Comments System** - Add comment functionality for blog posts
4. **Search Functionality** - Implement full-text search
5. **Email Notifications** - Send notifications on new posts
6. **Analytics Dashboard** - Show detailed analytics
7. **Pagination** - Add pagination to blog listing page

## 📄 License

This project is open source and available for personal and commercial use.

## 👩‍💻 Author

SimplySharon Blog Platform

---

Happy blogging! 🎉

# Blog CRUD Demo - React with MongoDB on VPS

A full-stack blog application built with React, Express, and MongoDB featuring real-time state management and CRUD operations.

## Features

- ✨ **React Frontend** with modern component architecture
- 🔄 **Real-time State Management** - posts update instantly without page refresh
- 💾 **MongoDB Integration** with in-memory fallback
- 🚀 **Production Ready** - optimized build for VPS deployment
- 📝 **Full CRUD Operations** - Create, Read, Update, Delete blog posts
- 🎨 **Clean UI** - responsive design with modern styling

## Project Structure

```
├── server.js              # Express API server
├── package.json           # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── index.html            # React app entry point
├── src/
│   ├── main.jsx          # React entry point
│   ├── App.jsx           # Main app component with state management
│   ├── index.css         # Global styles
│   ├── api.js            # API client functions
│   └── components/       # React components
│       ├── CreatePost.jsx
│       ├── PostsList.jsx
│       ├── PostItem.jsx
│       ├── EditPost.jsx
│       ├── StatusMessage.jsx
│       └── HealthCheck.jsx
└── public/               # Static assets (old HTML version)
```  

## API Endpoints

### Create Post
```
POST /api/posts
Body: { "title": "Post Title", "content": "Post content...", "author": "Author Name" }
```

### Get All Posts
```
GET /api/posts
```

### Get Single Post
```
GET /api/posts/:id
```

### Update Post
```
PUT /api/posts/:id
Body: { "title": "Updated Title", "content": "Updated content...", "author": "Author Name" }
```

### Delete Post
```
DELETE /api/posts/:id
```

### Health Check
```
GET /api/health
```


## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string_here
NODE_ENV=development
```

**Note:** If you don't set `MONGODB_URI`, the app will use in-memory storage (data will be lost on restart).

### 3. Run Development Mode

```bash
npm run dev
```

This starts both the Express server (port 3000) and Vite dev server (port 5173) concurrently.

- Frontend: http://localhost:5173
- API: http://localhost:3000/api

### 4. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### 5. Run Production Mode

```bash
NODE_ENV=production npm start
```

The server will serve both the API and React app on port 3000.

## State Management

The app uses React's built-in state management with hooks:

- `useState` for local component state
- `useEffect` for side effects (loading data)
- State is lifted to the main `App.jsx` component
- Posts are updated in real-time when created, updated, or deleted
- Changes are immediately reflected in the UI AND saved to the database

## Deployment to VPS

1. **Upload files to your VPS:**
   ```bash
   scp -r * user@your-vps-ip:/path/to/app
   ```

2. **Install dependencies on VPS:**
   ```bash
   ssh user@your-vps-ip
   cd /path/to/app
   npm install
   ```

3. **Build the React app:**
   ```bash
   npm run build
   ```

4. **Set environment variables:**
   ```bash
   export NODE_ENV=production
   export MONGODB_URI="your_mongodb_connection_string"
   export PORT=3000
   ```

5. **Run with PM2 (recommended):**
   ```bash
   npm install -g pm2
   pm2 start server.js --name blog-app
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx (optional):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Technologies Used

- **Frontend:** React 18, Vite
- **Backend:** Express.js, Node.js
- **Database:** MongoDB
- **Development:** Concurrently for running multiple processes

## License

MIT
```bash
curl http://localhost:3000/api/posts
```

**Get single post:**
```bash
curl http://localhost:3000/api/posts/1
```

**Update a post:**
```bash
curl -X PUT http://localhost:3000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","content":"Updated content","author":"John Doe"}'
```

**Delete a post:**
```bash
curl -X DELETE http://localhost:3000/api/posts/1
```

## License

MIT - Feel free to use this for learning and tutorials!

# Quick Start Guide

## Development Mode (with hot reload)

```bash
npm run dev
```

This runs both:
- Express API server on http://localhost:3000
- Vite dev server on http://localhost:5173 (with hot reload)

Open http://localhost:5173 in your browser to see the React app.

## Production Mode

Build the React app first:
```bash
npm run build
```

Then start the server:
```bash
$env:NODE_ENV="production"  # Windows PowerShell
npm start
```

Or on Linux/Mac:
```bash
NODE_ENV=production npm start
```

Open http://localhost:3000 in your browser.

## Environment Variables

Create a `.env` file:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blog_db
NODE_ENV=development
```

## State Management Features

✅ **Real-time updates**: When you create a post, it appears immediately in the list
✅ **Optimistic UI**: UI updates before server confirms
✅ **Database persistence**: All changes are saved to MongoDB
✅ **No page refresh needed**: All operations happen without reloading

## How State Management Works

1. **App.jsx** holds the main posts state using `useState`
2. When a post is created:
   - API call is made to save to database
   - New post is immediately added to state
   - UI re-renders to show the new post
3. When a post is updated:
   - API call is made to update database
   - State is updated with the modified post
   - UI re-renders to show changes
4. When a post is deleted:
   - API call is made to delete from database
   - Post is removed from state
   - UI re-renders without the deleted post

All state changes trigger React re-renders, so the UI always reflects the current state.

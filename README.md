# Community Hub - Social Media Platform

A complete, full-stack social media platform built with React, Node.js, Express, and MongoDB.

## Features

### User Management
- User registration and authentication (JWT)
- User profiles with bio, avatar, and cover image
- Follow/unfollow system
- User suggestions and recommendations

### Posts & Content
- Create, edit, delete posts with text and images
- Like/unlike posts
- Comment on posts
- Share posts
- Hashtag support
- Trending posts and hashtags

### Social Features
- Real-time notifications
- Direct messaging between users
- Search functionality (users, posts, hashtags)
- User feed with algorithm-based sorting
- Privacy settings

### Additional Features
- Admin dashboard
- User activity tracking
- Report inappropriate content
- Account settings and preferences
- Responsive design

## Tech Stack

### Frontend
- React.js with Hooks
- Redux Toolkit for state management
- Axios for API calls
- Tailwind CSS for styling
- Socket.io for real-time features
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Socket.io for real-time messaging
- Cloudinary for image storage

### Deployment
- Backend: Heroku / Railway / AWS
- Frontend: Vercel / Netlify
- Database: MongoDB Atlas

## Project Structure

```
community-hub/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Message.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── postRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── followRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── searchRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Post.js
│   │   │   ├── PrivateRoute.js
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   ├── Messages.js
│   │   │   ├── Notifications.js
│   │   │   ├── Search.js
│   │   │   ├── Settings.js
│   │   │   └── PostDetail.js
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── postsSlice.js
│   │   │   │   ├── notificationsSlice.js
│   │   │   │   └── messagesSlice.js
│   │   │   └── store.js
│   │   ├── index.js
│   │   ├── index.css
│   │   └── App.js
│   ├── public/
│   │   └── index.html
│   ├── .gitignore
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

#### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/community-hub
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

Start the server:
```bash
npm run dev
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
```

Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile (protected)
- `PUT /api/users/:userId/avatar` - Update avatar (protected)

### Posts
- `GET /api/posts/feed/home` - Get home feed (protected)
- `GET /api/posts/:postId` - Get post by ID
- `POST /api/posts` - Create post (protected)
- `POST /api/posts/:postId/like` - Like post (protected)
- `DELETE /api/posts/:postId` - Delete post (protected)

### Comments
- `GET /api/comments/post/:postId` - Get comments for post
- `POST /api/comments` - Add comment (protected)
- `POST /api/comments/:commentId/like` - Like comment (protected)
- `DELETE /api/comments/:commentId` - Delete comment (protected)

### Follow
- `POST /api/follows/:userId/follow` - Follow user (protected)
- `POST /api/follows/:userId/unfollow` - Unfollow user (protected)
- `GET /api/follows/:userId/followers` - Get followers
- `GET /api/follows/:userId/following` - Get following

### Messages
- `GET /api/messages` - Get all conversations (protected)
- `GET /api/messages/conversation/:userId` - Get messages with user (protected)
- `POST /api/messages` - Send message (protected)
- `PUT /api/messages/:messageId/read` - Mark message as read (protected)

### Notifications
- `GET /api/notifications` - Get notifications (protected)
- `PUT /api/notifications/:notificationId/read` - Mark as read (protected)
- `DELETE /api/notifications/:notificationId` - Delete notification (protected)

### Search
- `GET /api/search/users?q=query` - Search users
- `GET /api/search/posts?q=query` - Search posts
- `GET /api/search/hashtags?q=query` - Search hashtags
- `GET /api/search/trending/all` - Get trending content

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/community-hub
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

## Deployment

### Deploy Backend (Heroku)

```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy Frontend (Vercel)

```bash
npm install -g vercel
vercel
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@communityhub.com or open an issue on GitHub.

## Roadmap

- [ ] Video streaming
- [ ] Live streaming
- [ ] Stories feature
- [ ] Groups and communities
- [ ] Events
- [ ] Shopping integration
- [ ] AI-powered recommendations
- [ ] Mobile app (React Native)

## Authors

- **Shubham Verma** - Initial work - [@iamcverma](https://github.com/iamcverma)

---

**Happy coding! 🚀**

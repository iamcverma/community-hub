const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');

const router = express.Router();

// Search Users
router.get('/users', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { firstName: { $regex: q, $options: 'i' } },
        { lastName: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ]
    })
      .select('username firstName lastName avatar bio followers')
      .limit(parseInt(limit));

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search Posts
router.get('/posts', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const posts = await Post.find({
      $or: [
        { content: { $regex: q, $options: 'i' } },
        { hashtags: { $in: [q.toLowerCase()] } }
      ]
    })
      .populate('author', 'username avatar firstName lastName')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search Hashtags
router.get('/hashtags', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const hashtags = await Post.aggregate([
      {
        $match: {
          hashtags: { $regex: q, $options: 'i' }
        }
      },
      {
        $unwind: '$hashtags'
      },
      {
        $match: {
          hashtags: { $regex: q, $options: 'i' }
        }
      },
      {
        $group: {
          _id: '$hashtags',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json(hashtags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Trending
router.get('/trending/all', async (req, res) => {
  try {
    const trendingHashtags = await Post.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $unwind: '$hashtags'
      },
      {
        $group: {
          _id: '$hashtags',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const trendingPosts = await Post.find()
      .sort({ likes: -1 })
      .limit(5)
      .populate('author', 'username avatar');

    res.json({
      trendingHashtags,
      trendingPosts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

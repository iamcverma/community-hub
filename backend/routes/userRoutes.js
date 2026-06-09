const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get User Profile
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar')
      .populate({
        path: 'posts',
        options: { sort: { createdAt: -1 }, limit: 10 }
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update User Profile
router.put('/:userId', auth, async (req, res) => {
  try {
    if (req.userId !== req.params.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { firstName, lastName, bio, website, location, isPrivate } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        firstName,
        lastName,
        bio,
        website,
        location,
        isPrivate
      },
      { new: true }
    );

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Avatar
router.put('/:userId/avatar', auth, async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { avatar },
      { new: true }
    );
    res.json({ message: 'Avatar updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Users (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('username firstName lastName avatar bio followers')
      .limit(limit)
      .skip(skip);

    const total = await User.countDocuments();

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

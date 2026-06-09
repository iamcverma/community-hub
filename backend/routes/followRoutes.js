const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Follow User
router.post('/:userId/follow', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.userId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.userId === req.params.userId) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    if (currentUser.following.includes(req.params.userId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following.push(req.params.userId);
    targetUser.followers.push(req.userId);

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: 'User followed successfully',
      followers: targetUser.followers.length,
      following: currentUser.following.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unfollow User
router.post('/:userId/unfollow', auth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.userId);

    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    currentUser.following = currentUser.following.filter(
      id => id.toString() !== req.params.userId
    );
    targetUser.followers = targetUser.followers.filter(
      id => id.toString() !== req.userId
    );

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: 'User unfollowed successfully',
      followers: targetUser.followers.length,
      following: currentUser.following.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Followers
router.get('/:userId/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username avatar firstName lastName bio');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Following
router.get('/:userId/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('following', 'username avatar firstName lastName bio');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.following);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

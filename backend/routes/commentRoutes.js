const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

const router = express.Router();

// Add Comment
router.post('/', auth, async (req, res) => {
  try {
    const { post, content, parentComment } = req.body;

    if (!post || !content) {
      return res.status(400).json({ message: 'Post and content are required' });
    }

    const postExists = await Post.findById(post);
    if (!postExists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      post,
      author: req.userId,
      content,
      parentComment: parentComment || null
    });

    await comment.save();
    await comment.populate('author', 'username avatar firstName lastName');

    postExists.comments.push(comment._id);
    await postExists.save();

    res.status(201).json({ message: 'Comment added', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Comments for Post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username avatar firstName lastName')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Like Comment
router.post('/:commentId/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.likes.includes(req.userId)) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.userId);
    } else {
      comment.likes.push(req.userId);
    }

    await comment.save();
    res.json({ message: 'Comment liked', likes: comment.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Comment
router.delete('/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    
    await Post.findByIdAndUpdate(
      comment.post,
      { $pull: { comments: req.params.commentId } }
    );

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

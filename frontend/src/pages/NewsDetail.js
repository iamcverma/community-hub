import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaHeart, FaComment, FaCalendar, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const NewsDetail = () => {
  const { newsId } = useParams();
  const { user } = useSelector(state => state.auth);
  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchNews();
    fetchComments();
  }, [newsId]);

  const fetchNews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/news/${newsId}`);
      setNews(response.data);
      setLiked(response.data.likes.includes(user?._id));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/news-comments/${newsId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`http://localhost:5000/api/news/${newsId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLiked(!liked);
      fetchNews();
    } catch (error) {
      console.error('Failed to like news:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/news-comments', 
        { news: newsId, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading news...</div>;
  }

  if (!news) {
    return <div className="text-center py-12">News not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <img src={news.featuredImage} alt={news.title} className="w-full h-96 object-cover rounded-lg mb-6" />
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
            {news.category}
          </span>
          <span className="text-gray-600 flex items-center space-x-1">
            <FaCalendar /> {new Date(news.publishedAt).toLocaleDateString()}
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">{news.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{news.description}</p>
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
          <img src={news.author.avatar} alt={news.author.username} className="w-12 h-12 rounded-full" />
          <div>
            <p className="font-bold">{news.author.firstName} {news.author.lastName}</p>
            <p className="text-gray-600">@{news.author.username}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6 mb-6 pb-6 border-b">
        <span className="flex items-center space-x-2 text-gray-600">
          <FaEye /> {news.views} views
        </span>
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 ${liked ? 'text-red-600 font-bold' : 'text-gray-600 hover:text-red-600'}`}
        >
          <FaHeart /> {news.likes.length} likes
        </button>
        <span className="flex items-center space-x-2 text-gray-600">
          <FaComment /> {news.comments.length} comments
        </span>
      </div>

      <div className="prose max-w-none mb-8">
        <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-wrap">{news.content}</p>
      </div>

      {news.tags && news.tags.length > 0 && (
        <div className="mb-8 pb-8 border-b">
          <p className="font-bold mb-2">Tags:</p>
          <div className="flex flex-wrap gap-2">
            {news.tags.map(tag => (
              <span key={tag} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

        <form onSubmit={handleCommentSubmit} className="mb-8 p-4 bg-gray-100 rounded-lg">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment..."
            className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:border-blue-500"
            rows="3"
          />
          <button
            type="submit"
            className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold"
          >
            Post Comment
          </button>
        </form>

        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment._id} className="bg-white p-4 rounded-lg border">
              <div className="flex items-center space-x-3 mb-2">
                <img src={comment.author.avatar} alt={comment.author.username} className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-bold">{comment.author.firstName} {comment.author.lastName}</p>
                  <p className="text-gray-600 text-sm">@{comment.author.username}</p>
                </div>
              </div>
              <p className="text-gray-800 mb-2">{comment.content}</p>
              <div className="flex items-center space-x-4 text-gray-600 text-sm">
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center space-x-1">
                  <FaHeart /> {comment.likes.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;

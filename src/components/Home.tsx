import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { useUser } from '../context/UserContext';
import toast from 'react-hot-toast';

interface Confession {
  id: number;
  content: string;
  likes: number;
  comments: { id: number; content: string }[];
}

const Home: React.FC = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [newComment, setNewComment] = useState('');
  const [activeConfession, setActiveConfession] = useState<number | null>(null);
  const { user } = useUser();

  useEffect(() => {
    fetchConfessions();
  }, []);

  const fetchConfessions = async () => {
    try {
      const response = await fetch('/api/confessions');
      const data = await response.json();
      setConfessions(data);
    } catch (error) {
      toast.error('Failed to fetch confessions');
    }
  };

  const handleLike = async (id: number) => {
    if (!user) {
      toast.error('Please log in to like confessions');
      return;
    }
    try {
      await fetch(`/api/confessions/${id}/like`, { method: 'POST' });
      setConfessions(confessions.map(conf =>
        conf.id === id ? { ...conf, likes: conf.likes + 1 } : conf
      ));
    } catch (error) {
      toast.error('Failed to like confession');
    }
  };

  const handleComment = async (id: number) => {
    if (!user) {
      toast.error('Please log in to comment');
      return;
    }
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    try {
      const response = await fetch(`/api/confessions/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await response.json();
      setConfessions(confessions.map(conf =>
        conf.id === id ? { ...conf, comments: [...conf.comments, data] } : conf
      ));
      setNewComment('');
      setActiveConfession(null);
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Recent Confessions</h1>
      {confessions.map(confession => (
        <div key={confession.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <p className="text-lg mb-4 text-gray-800">{confession.content}</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => handleLike(confession.id)} className="flex items-center text-pink-500 hover:text-pink-600 transition duration-300">
              <Heart className="mr-1" /> {confession.likes}
            </button>
            <button onClick={() => setActiveConfession(activeConfession === confession.id ? null : confession.id)} className="flex items-center text-blue-500 hover:text-blue-600 transition duration-300">
              <MessageCircle className="mr-1" /> {confession.comments.length} comments
            </button>
          </div>
          {activeConfession === confession.id && (
            <div className="mt-4 space-y-2">
              {confession.comments.map(comment => (
                <p key={comment.id} className="text-sm text-gray-600 bg-gray-100 p-2 rounded">{comment.content}</p>
              ))}
              <div className="flex items-center mt-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button onClick={() => handleComment(confession.id)} className="bg-indigo-500 text-white p-2 rounded-r hover:bg-indigo-600 transition duration-300">
                  <Send size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Home;
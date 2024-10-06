import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Confess: React.FC = () => {
  const [confession, setConfession] = useState('');
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to make a confession');
      return;
    }
    if (!confession.trim()) {
      toast.error('Confession cannot be empty');
      return;
    }
    try {
      const response = await fetch('/api/confessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: confession }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      toast.success('Confession submitted successfully');
      setConfession('');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to submit confession');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-800">Make a Confession</h1>
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={confession}
            onChange={(e) => setConfession(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={5}
            placeholder="Share your secret..."
            required
          />
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition duration-300 flex items-center justify-center">
            <Send className="mr-2" /> Submit Confession
          </button>
        </form>
      ) : (
        <p className="text-red-500 text-center">Please log in to make a confession.</p>
      )}
    </div>
  );
};

export default Confess;
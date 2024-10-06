import React from 'react';
import { useUser } from '../context/UserContext';
import { DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const Premium: React.FC = () => {
  const { user, updateUser } = useUser();

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please log in to upgrade');
      return;
    }
    try {
      const response = await fetch('/api/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to upgrade');
      }
      const data = await response.json();
      updateUser(data.user);
      toast.success('Upgraded to premium successfully');
    } catch (error) {
      toast.error('Failed to upgrade to premium');
    }
  };

  if (!user) {
    return <p className="text-red-500 text-center">Please log in to access premium features.</p>;
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6 text-indigo-800">Premium Upgrade</h1>
      {user.tier === 'premium' ? (
        <p className="text-green-600 font-semibold">You are already a premium user!</p>
      ) : (
        <div>
          <p className="mb-4">Upgrade to premium for just $1 and confess daily!</p>
          <button
            onClick={handleUpgrade}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition duration-300 flex items-center justify-center mx-auto"
          >
            <DollarSign className="mr-2" /> Upgrade to Premium
          </button>
        </div>
      )}
    </div>
  );
};

export default Premium;
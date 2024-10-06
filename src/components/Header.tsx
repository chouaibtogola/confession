import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Lock, Unlock, User, DollarSign } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useUser();

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Lock className="mr-2" /> Whisper
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-indigo-200 transition duration-300">Home</Link></li>
            <li><Link to="/confess" className="hover:text-indigo-200 transition duration-300">Confess</Link></li>
            {user ? (
              <>
                <li>
                  <Link to="/premium" className="hover:text-indigo-200 transition duration-300 flex items-center">
                    <DollarSign className="mr-1" size={18} /> Premium
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="hover:text-indigo-200 transition duration-300 flex items-center">
                    <Unlock className="mr-1" size={18} /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="hover:text-indigo-200 transition duration-300 flex items-center">
                  <User className="mr-1" size={18} /> Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Confess from './components/Confess';
import Login from './components/Login';
import Premium from './components/Premium';
import { UserProvider } from './context/UserContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/confess" element={<Confess />} />
              <Route path="/login" element={<Login />} />
              <Route path="/premium" element={<Premium />} />
            </Routes>
          </main>
          <Toaster position="bottom-right" />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
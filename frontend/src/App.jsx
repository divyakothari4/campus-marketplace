import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './styles/retro.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('home');
    alert('👋 Logged out successfully!');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'signup':
        return <Signup setCurrentPage={setCurrentPage} />;
      case 'login':
        return <Login setCurrentPage={setCurrentPage} />;
      case 'dashboard':
        return user ? <Dashboard /> : <Login setCurrentPage={setCurrentPage} />;
      default:
        return <Home />;
    }
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh' }}>
      {/* NAVBAR */}
      <nav style={{
        backgroundColor: '#222',
        padding: '15px 20px',
        borderBottom: '3px solid cyan',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h1
          onClick={() => { setCurrentPage('home'); setUser(JSON.parse(localStorage.getItem('user') || 'null')); }}
          style={{
            cursor: 'pointer',
            color: 'hotpink',
            textShadow: '2px 2px 0 cyan',
            fontSize: '1.5em',
            fontWeight: 'bold',
            margin: 0
          }}
        >
          🛒 CAMPUS MARKETPLACE
        </h1>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            style={{
              padding: '10px 15px',
              backgroundColor: 'limegreen',
              border: '2px solid white',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'black'
            }}
            onClick={() => setCurrentPage('home')}
          >
            🏠 HOME
          </button>

          {user ? (
            <>
              <button
                style={{
                  padding: '10px 15px',
                  backgroundColor: 'cyan',
                  border: '2px solid white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: 'black'
                }}
                onClick={() => setCurrentPage('dashboard')}
              >
                📊 DASHBOARD
              </button>
              <button
                style={{
                  padding: '10px 15px',
                  backgroundColor: 'hotpink',
                  border: '2px solid white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: 'white'
                }}
                onClick={handleLogout}
              >
                🚪 LOGOUT
              </button>
            </>
          ) : (
            <>
              <button
                style={{
                  padding: '10px 15px',
                  backgroundColor: 'cyan',
                  border: '2px solid white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: 'black'
                }}
                onClick={() => setCurrentPage('login')}
              >
                🔐 LOGIN
              </button>
              <button
                style={{
                  padding: '10px 15px',
                  backgroundColor: 'limegreen',
                  border: '2px solid white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: 'black'
                }}
                onClick={() => setCurrentPage('signup')}
              >
                ✍️ SIGNUP
              </button>
            </>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      {renderPage()}

      {/* FOOTER */}
      <footer style={{
        backgroundColor: '#111',
        borderTop: '3px dashed limegreen',
        padding: '20px',
        textAlign: 'center',
        marginTop: '50px',
        color: 'cyan'
      }}>
        <p style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
          🎉 Campus Marketplace - Buy & Sell on Campus! Built with ❤️ and MERN Stack
        </p>
      </footer>
    </div>
  );
}
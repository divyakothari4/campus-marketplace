import React, { useState } from 'react';
import axios from 'axios';

export default function Signup({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      alert('✅ Signup successful!');
      setCurrentPage('home');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 className="pixel-text" style={{ color: 'limegreen', textShadow: '2px 2px 0 hotpink' }}>
        ✍️ CREATE ACCOUNT
      </h1>

      {error && (
        <div style={{ backgroundColor: '#FF1493', color: 'white', padding: '15px', marginBottom: '20px', border: '3px solid white', fontWeight: 'bold' }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="pixel-border" style={{ backgroundColor: '#111', padding: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: 'cyan', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            👤 Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="cooluser123"
            value={formData.username}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '2px solid cyan', backgroundColor: '#222', color: 'white', fontWeight: 'bold' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: 'cyan', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            📧 Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '2px solid cyan', backgroundColor: '#222', color: 'white', fontWeight: 'bold' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ color: 'cyan', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            🔑 Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '2px solid cyan', backgroundColor: '#222', color: 'white', fontWeight: 'bold' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: 'cyan', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
            🔑 Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '10px', border: '2px solid cyan', backgroundColor: '#222', color: 'white', fontWeight: 'bold' }}
          />
        </div>

        <button
          type="submit"
          className="retro-button"
          style={{ width: '100%', backgroundColor: 'limegreen' }}
          disabled={loading}
        >
          {loading ? '⏳ CREATING...' : '🚀 SIGN UP'}
        </button>
      </form>
    </div>
  );
}
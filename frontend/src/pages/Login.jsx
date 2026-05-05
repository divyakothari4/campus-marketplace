import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      alert('✅ Login successful!');
      setCurrentPage('dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 className="pixel-text" style={{ color: 'hotpink', textShadow: '2px 2px 0 cyan' }}>
        🔐 LOGIN
      </h1>

      {error && (
        <div style={{ backgroundColor: '#FF1493', color: 'white', padding: '15px', marginBottom: '20px', border: '3px solid white', fontWeight: 'bold' }}>
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="pixel-border" style={{ backgroundColor: '#111', padding: '30px' }}>
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
            style={{ width: '100%', padding: '10px', border: '2px solid hotpink', backgroundColor: '#222', color: 'white', fontWeight: 'bold' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
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
            style={{ width: '100%', padding: '10px', border: '2px solid hotpink', backgroundColor: '#222', color: 'white', fontWeight: 'bold' }}
          />
        </div>

        <button
          type="submit"
          className="retro-button"
          style={{ width: '100%' }}
          disabled={loading}
        >
          {loading ? '⏳ LOGGING IN...' : '✅ LOGIN'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '20px', color: 'cyan', fontWeight: 'bold' }}>
        Don't have an account?{' '}
        <span
          onClick={() => setCurrentPage('signup')}
          style={{ color: 'limegreen', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Sign up here
        </span>
      </p>
    </div>
  );
}
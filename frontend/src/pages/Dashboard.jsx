import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    condition: 'New'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      fetchUserItems();
    }
  }, []);

  const fetchUserItems = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/items/user/${userData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/items', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Item posted successfully!');
      setFormData({ title: '', description: '', price: '', category: 'Electronics', condition: 'New' });
      setShowForm(false);
      fetchUserItems();
    } catch (error) {
      alert('❌ Error posting item: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/items/${itemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert('✅ Item deleted!');
        fetchUserItems();
      } catch (error) {
        alert('❌ Error deleting item');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="pixel-text" style={{ color: 'limegreen', textShadow: '2px 2px 0 hotpink' }}>
        📊 MY DASHBOARD
      </h1>
      {user && (
        <p style={{ color: 'cyan', fontSize: '1.2em', marginBottom: '20px' }}>
          Welcome back, <span style={{ color: 'hotpink', fontWeight: 'bold' }}>{user.username}</span>! 👋
        </p>
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="pixel-border" style={{ backgroundColor: '#111', padding: '20px', textAlign: 'center' }}>
          <h3 style={{ color: 'hotpink', fontSize: '2em' }}>{items.length}</h3>
          <p style={{ color: 'cyan', fontWeight: 'bold' }}>📦 My Listings</p>
        </div>
        <div className="pixel-border" style={{ backgroundColor: '#111', padding: '20px', textAlign: 'center' }}>
          <h3 style={{ color: 'limegreen', fontSize: '2em' }}>⭐ 5.0</h3>
          <p style={{ color: 'cyan', fontWeight: 'bold' }}>Seller Rating</p>
        </div>
      </div>

      {/* Toggle Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          className="retro-button"
          onClick={() => setShowForm(!showForm)}
          style={{ backgroundColor: showForm ? 'hotpink' : 'limegreen' }}
        >
          {showForm ? 'HIDE FORM ❌' : 'POST NEW ITEM ➕'}
        </button>
      </div>

      {/* Post Item Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="pixel-border" style={{ backgroundColor: '#111', padding: '20px', marginBottom: '30px' }}>
          <h2 style={{ color: 'hotpink', marginBottom: '20px' }}>Post Item for Sale</h2>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: 'cyan', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              📝 Item Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., iPhone 12 Pro"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '2px solid hotpink', backgroundColor: '#222', color: 'white', fontWeight: 'bold' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: 'cyan', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
              📄 Description
            </label>
            <textarea
              name="description"
              placeholder="Describe your item..."
              value={formData.description}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', border: '2px solid hotpink', backgroundColor: '#222', color: 'white', fontWeight: 'bold', minHeight: '100px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ color: 'cyan', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                💰 Price ($)
              </label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px', border: '2px solid hotpink', backgroundColor: '#222', color: 'white', fontWeight: 'bold' }}
              />
            </div>

            <div>
              <label style={{ color: 'cyan', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                📂 Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', border: '2px solid hotpink', backgroundColor: '#222', color: 'white', fontWeight: 'bold' }}
              >
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ color: 'cyan', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                ✨ Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', border: '2px solid hotpink', backgroundColor: '#222', color: 'white', fontWeight: 'bold' }}
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="retro-button"
            style={{ width: '100%', backgroundColor: 'limegreen' }}
            disabled={loading}
          >
            {loading ? '⏳ POSTING...' : '🚀 POST ITEM'}
          </button>
        </form>
      )}

      {/* My Listings */}
      <h2 style={{ color: 'hotpink', marginBottom: '20px', textShadow: '2px 2px 0 cyan' }}>
        📦 MY LISTINGS
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item._id} className="pixel-border" style={{ backgroundColor: '#111' }}>
              <div style={{ backgroundColor: 'cyan', color: 'black', padding: '15px', textAlign: 'center', fontSize: '2em', marginBottom: '10px' }}>
                📦
              </div>
              <h3 style={{ color: 'cyan', marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ color: 'hotpink', fontSize: '1.5em', fontWeight: 'bold', marginBottom: '10px' }}>
                ${item.price}
              </p>
              <p style={{ color: 'limegreen', marginBottom: '5px' }}>Status: {item.status}</p>
              <p style={{ color: 'yellow', marginBottom: '15px' }}>Views: {item.views}</p>
              <button
                className="retro-button"
                onClick={() => handleDelete(item._id)}
                style={{ width: '100%', backgroundColor: 'hotpink' }}
              >
                DELETE ❌
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: 'yellow', fontSize: '1.2em' }}>
            📭 No items posted yet! Click "POST NEW ITEM" to get started!
          </p>
        )}
      </div>
    </div>
  );
}
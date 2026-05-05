import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Could not fetch items. Make sure backend is running on http://localhost:5000');
    }
    setLoading(false);
  };

  useEffect(() => {
    let filtered = items;

    if (search) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }

    if (minPrice) {
      filtered = filtered.filter(item => item.price >= Number(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(item => item.price <= Number(maxPrice));
    }

    setFilteredItems(filtered);
  }, [search, category, minPrice, maxPrice, items]);

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="pixel-text" style={{ color: 'hotpink', textShadow: '2px 2px 0 cyan' }}>
        🛒 CAMPUS MARKETPLACE
      </h1>
      <p style={{ fontSize: '1.2em', color: 'cyan' }}>Find amazing items from fellow students!</p>

      {/* Search & Filter Section */}
      <div className="pixel-border" style={{ backgroundColor: '#111', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ color: 'cyan', fontWeight: 'bold' }}>🔍 Search</label>
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '2px solid hotpink', backgroundColor: '#222', color: 'white' }}
            />
          </div>

          <div>
            <label style={{ color: 'cyan', fontWeight: 'bold' }}>📂 Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '2px solid hotpink', backgroundColor: '#222', color: 'white' }}
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Books">Books</option>
              <option value="Furniture">Furniture</option>
              <option value="Clothing">Clothing</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ color: 'cyan', fontWeight: 'bold' }}>💰 Min Price</label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '2px solid hotpink', backgroundColor: '#222', color: 'white' }}
            />
          </div>

          <div>
            <label style={{ color: 'cyan', fontWeight: 'bold' }}>💸 Max Price</label>
            <input
              type="number"
              placeholder="999"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '2px solid hotpink', backgroundColor: '#222', color: 'white' }}
            />
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {loading ? (
          <p style={{ color: 'cyan', fontSize: '1.2em' }}>Loading items...</p>
        ) : filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item._id} className="pixel-border" style={{ backgroundColor: '#111' }}>
              <div style={{ backgroundColor: 'cyan', color: 'black', padding: '20px', textAlign: 'center', fontSize: '2em', marginBottom: '10px' }}>
                📦
              </div>
              <h3 style={{ color: 'cyan', marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ color: 'hotpink', fontSize: '1.5em', fontWeight: 'bold', marginBottom: '10px' }}>
                ${item.price}
              </p>
              <p style={{ color: 'limegreen', marginBottom: '5px' }}>📂 {item.category}</p>
              <p style={{ color: 'limegreen', marginBottom: '5px' }}>✨ {item.condition}</p>
              <p style={{ color: 'yellow', marginBottom: '15px' }}>👤 {item.sellerName}</p>
              <button
                className="retro-button"
                onClick={() => alert(`Item: ${item.title}\n\nPrice: $${item.price}\n\nSeller: ${item.sellerName}\n\nDescription: ${item.description}`)}
              >
                VIEW DETAILS 👀
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: 'hotpink', fontSize: '1.2em' }}>
            😭 No items found! Try adjusting your filters.
          </p>
        )}
      </div>
    </div>
  );
}
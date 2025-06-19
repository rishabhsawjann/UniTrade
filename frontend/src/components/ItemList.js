import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ItemList.css';

function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('https://unitrade-backend-wwfh.onrender.com/api/items');
        setItems(res.data);
      } catch (err) {
        setError('Failed to load items.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`https://unitrade-backend-wwfh.onrender.com/api/items/${id}`,
        { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }
      );
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  return (
    <div className="item-list-container">
      <div className="item-list-header">
        <h1>Browse Items</h1>
        <Link to="/create-item" className="sell-button">
          Sell Your Item
        </Link>
      </div>
      
      <div className="filters">
        <select className="filter-select">
          <option value="">All Categories</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
        </select>
        <select className="filter-select">
          <option value="">Price Range</option>
          <option value="0-50">₹0 - ₹50</option>
          <option value="51-100">₹51 - ₹100</option>
          <option value="101+">₹101+</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 40 }}>Loading items...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>
      ) : (
        <div className="items-grid">
          {items.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>
              No items found.
            </div>
          ) : (
            items.map(item => (
              <div key={item._id} className="item-card">
                <img
                  src={item.imageUrl ? `https://unitrade-backend-wwfh.onrender.com${item.imageUrl}` : 'https://placehold.co/300x200?text=No+Image'}
                  alt={item.title}
                  className="item-image"
                />
                <div className="item-info">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-price">₹{item.price}</p>
                  <p className="item-description">{item.description}</p>
                  <div className="item-meta">
                    <span className="item-category">{item.category}</span>
                    <span className="item-location">{item.location}</span>
                  </div>
                  <Link to={`/items/${item._id}`} className="view-item-button">
                    View Details
                  </Link>
                  {item.user === user.id && (
                    <button onClick={() => handleDelete(item._id)} style={{marginTop: 10, background: '#e53e3e', color: 'white', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 600, cursor: 'pointer'}}>Delete</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default ItemList; 
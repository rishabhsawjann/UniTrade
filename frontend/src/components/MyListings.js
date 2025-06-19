import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MyListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('https://unitrade-backend-wwfh.onrender.com/api/items');
        setItems(res.data.filter(item => item.user === user.id));
      } catch (err) {
        setError('Failed to load your items.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [user.id]);

  const handleMarkSold = async (id) => {
    if (!window.confirm('Mark this item as sold?')) return;
    try {
      await axios.patch(`https://unitrade-backend-wwfh.onrender.com/api/items/${id}/sold`, {}, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      setItems(items.map(item => item._id === id ? { ...item, sold: true } : item));
    } catch (err) {
      alert('Failed to mark as sold.');
    }
  };

  return (
    <div className="item-list-container">
      <h1>My Listings</h1>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 40 }}>Loading your items...</div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>
      ) : (
        <div className="items-grid">
          {items.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>
              You have not posted any items yet.
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
                  {!item.sold && (
                    <button onClick={() => handleMarkSold(item._id)} style={{marginTop: 10, background: '#38a169', color: 'white', border: 'none', borderRadius: 6, padding: '10px 18px', fontWeight: 600, cursor: 'pointer'}}>Mark as Sold</button>
                  )}
                  {item.sold && <div style={{marginTop: 10, color: '#38a169', fontWeight: 600}}>Sold</div>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MyListings; 
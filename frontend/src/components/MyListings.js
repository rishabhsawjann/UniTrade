
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MyListings.css'; // Import the stylesheet

function MyListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    async function fetchMyItems() {
      if (!user) {
        setError("Please log in to see your listings.");
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/items', {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        const userItems = res.data.filter(item => item.user === user.id);
        setItems(userItems);
      } catch (err) {
        setError('Failed to fetch your listings.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyItems();
  }, []);

  const handleSold = async (id) => {
    if (window.confirm('Are you sure you want to mark this item as sold? This cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(`http://localhost:5000/api/items/${id}/sold`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setItems(prevItems => 
          prevItems.map(item => item._id === id ? { ...item, sold: true } : item)
        );
      } catch (err) {
        console.error("Failed to mark as sold", err);
        alert('Could not mark item as sold. Please try again.');
      }
    }
  };

  if (loading) return <div className="my-listings-container"><p style={{textAlign: 'center'}}>Loading your listings...</p></div>;
  if (error) return <div className="my-listings-container"><p style={{textAlign: 'center', color: 'red'}}>{error}</p></div>;

  return (
    <div className="my-listings-container">
      <div className="my-listings-header">
        <h1>My Listings</h1>
      </div>
      {items.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666' }}>
          You haven't listed any items yet. <Link to="/sell">Sell an Item</Link>
        </p>
      ) : (
        <div className="my-listings-grid">
          {items.map(item => (
            <div key={item._id} className="my-listings-item-card">
              <Link to={`/items/${item._id}`} className="my-listings-item-image">
                <img
                  src={item.imageUrl ? `http://localhost:5000${item.imageUrl}` : 'https://placehold.co/300x200?text=No+Image'}
                  alt={item.title}
                />
              </Link>
              <div className="my-listings-item-info">
                <div>
                    <h3>{item.title}</h3>
                    <p>Price: ₹{item.price}</p>
                </div>
                <div className="my-listings-actions">
                  <button
                    onClick={() => handleSold(item._id)}
                    disabled={item.sold}
                    className={`sold-button ${item.sold ? 'already-sold' : 'mark-sold'}`}
                  >
                    {item.sold ? 'Sold' : 'Mark as Sold'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;
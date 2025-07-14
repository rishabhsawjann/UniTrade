import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ItemDetail.css';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await axios.get(`http://localhost:5000/api/items/${id}`);
        setItem(res.data);
      } catch (err) {
        setError('Failed to fetch item details.');
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="item-detail-container">
      <div className="item-detail-card">
        <div className="item-detail-image-container">
          <img 
            src={item.imageUrl ? `http://localhost:5000${item.imageUrl}` : 'https://placehold.co/600x400?text=No+Image'} 
            alt={item.title} 
            className="item-detail-image" 
          />
        </div>
        <div className="item-detail-info">
          <h1 className="item-detail-title">{item.title}</h1>
          <p className="item-detail-price">₹{item.price}</p>
          <p className="item-detail-description">{item.description}</p>
          <div className="item-detail-meta">
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Location:</strong> {item.location}</p>
          </div>
          <a 
            href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="whatsapp-link"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
      <Link to="/items" className="back-link">← Back to all items</Link>
    </div>
  );
}

export default ItemDetail; 
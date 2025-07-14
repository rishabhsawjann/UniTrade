import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`https://unitrade-backend-wwfh.onrender.com/api/items/${id}`);
        setItem(res.data);
      } catch (err) {
        setError('Failed to load item.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading item...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</div>;
  if (!item) return <div style={{ textAlign: 'center', marginTop: 40 }}>Item not found.</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: 600, margin: '0 auto' }}>
      <h1>{item.title}</h1>
      {item.imageUrl && (
        <img src={`https://unitrade-backend-wwfh.onrender.com${item.imageUrl}`} alt={item.title} style={{ maxWidth: '100%', borderRadius: 10, marginBottom: 20 }} />
      )}
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Price:</strong> ₹{item.price}</p>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>WhatsApp:</strong> <a href={`https://wa.me/${item.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></p>
      <Link to="/items" style={{ display: 'inline-block', marginTop: 20, color: '#667eea', textDecoration: 'underline' }}>Back to Items</Link>
    </div>
  );
}

export default ItemDetail; 
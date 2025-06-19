import React, { useState } from 'react';
import axios from 'axios';
import './CreateItem.css';

const categories = [
  'Books',
  'Clothing',
  'Electronics',
  'Furniture',
  'Other'
];

function CreateItem() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    whatsapp: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      await axios.post('https://unitrade-backend-wwfh.onrender.com/api/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setForm({ title: '', description: '', price: '', category: '', location: '', whatsapp: '', image: null });
      setPreview(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to post item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-item-container">
      <div className="create-item-card">
        <div className="create-item-title">Sell an Item</div>
        <form onSubmit={handleSubmit} className="create-item-form">
          <label>
            Item Title*
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Calculus Textbook"
            />
          </label>
          <label>
            Description*
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Describe your item"
              rows={4}
            />
          </label>
          <label>
            Price ($)*
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min={0}
              step={0.01}
              placeholder="e.g. 25"
            />
          </label>
          <label>
            Category*
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <label>
            Location*
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="e.g. University Campus"
            />
          </label>
          <label>
            WhatsApp Number*
            <input
              type="tel"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              required
              placeholder="e.g. +1234567890"
              pattern="^\+?[0-9]{10,15}$"
              title="Enter a valid WhatsApp number with country code"
            />
          </label>
          <label>
            Image
            <input type="file" name="image" accept="image/*" onChange={handleChange} />
          </label>
          {preview && (
            <div className="create-item-image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
          <button type="submit" className="create-item-submit-btn" disabled={loading}>
            {loading ? 'Posting...' : 'Post Item'}
          </button>
          {success && <div className="create-item-success">Item posted successfully!</div>}
          {error && <div style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default CreateItem; 
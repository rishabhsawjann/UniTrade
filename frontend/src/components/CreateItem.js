import React, { useState } from 'react';
import axios from 'axios';
import './CreateItem.css';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaBuilding, FaMobileAlt, FaBriefcase, FaBicycle, FaDesktop, FaTruck, FaCouch, FaTshirt, FaBook, FaPaw, FaConciergeBell } from 'react-icons/fa';

const categories = [
  { name: 'Cars', icon: <FaCar /> },
  { name: 'Properties', icon: <FaBuilding /> },
  { name: 'Mobiles', icon: <FaMobileAlt /> },
  { name: 'Jobs', icon: <FaBriefcase /> },
  { name: 'Bikes', icon: <FaBicycle /> },
  { name: 'Electronics & Appliances', icon: <FaDesktop /> },
  { name: 'Commercial Vehicles & Spares', icon: <FaTruck /> },
  { name: 'Furniture', icon: <FaCouch /> },
  { name: 'Fashion', icon: <FaTshirt /> },
  { name: 'Books, Sports & Hobbies', icon: <FaBook /> },
  { name: 'Pets', icon: <FaPaw /> },
  { name: 'Services', icon: <FaConciergeBell /> },
];

function CreateItem() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    whatsapp: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files && files[0] ? files[0] : null });
      if (files && files[0]) {
        setPreview(URL.createObjectURL(files[0]));
      } else {
        setPreview(null);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      setError('Please select a category first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      // Append all form fields
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      // Append selected category
      formData.append('category', selectedCategory.name);

      await axios.post('http://localhost:5000/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/items');
      }, 2000);
    } catch (err) {
      setError('Failed to post item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCategorySelector = () => (
    <div className="category-selector">
      <h2 className="selector-title">CHOOSE A CATEGORY</h2>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.name} className="category-item" onClick={() => setSelectedCategory(category)}>
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
            <span className="category-arrow">&gt;</span>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="create-item-form">
      <div className="form-section">
        <div className="selected-category-header">
          <p>SELECTED CATEGORY</p>
          <div>
            <span>{selectedCategory.name}</span>
            <button type="button" className="change-category-btn" onClick={() => setSelectedCategory(null)}>Change</button>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3 className="form-section-title">INCLUDE SOME DETAILS</h3>
        <label>
          Ad title *
          <input
            type="text" name="title" value={form.title} onChange={handleChange}
            required placeholder="Mention the key features of your item (e.g. brand, model, age, type)"
            maxLength="70"
          />
        </label>
        <label>
          Description *
          <textarea
            name="description" value={form.description} onChange={handleChange}
            required placeholder="Include condition, features and reason for selling"
            maxLength="4096"
          />
        </label>
      </div>
      
       <div className="form-section">
        <h3 className="form-section-title">SET A PRICE</h3>
         <label>
          Price *
          <input
            type="number" name="price" value={form.price} onChange={handleChange}
            required placeholder="₹"
          />
        </label>
      </div>

      <div className="form-section">
         <h3 className="form-section-title">YOUR LOCATION</h3>
        <label>
          Location*
          <input type="text" name="location" value={form.location} onChange={handleChange} required />
        </label>
      </div>

       <div className="form-section">
         <h3 className="form-section-title">CONTACT DETAILS</h3>
        <label>
          WhatsApp Number*
          <input type="tel" name="whatsapp" value={form.whatsapp} onChange={handleChange} required />
        </label>
      </div>
      
      <div className="form-section">
        <h3 className="form-section-title">UPLOAD IMAGE</h3>
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        {preview && (
          <div className="create-item-image-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}
      </div>

      <button type="submit" className="create-item-submit-btn" disabled={loading}>
        {loading ? 'Posting...' : 'Post Ad'}
      </button>
      {success && <div className="create-item-success">Item posted successfully! Redirecting...</div>}
      {error && <div className="create-item-error">{error}</div>}
    </form>
  );

  return (
    <div className="create-item-container">
      <div className="create-item-card">
        {selectedCategory ? renderForm() : renderCategorySelector()}
      </div>
    </div>
  );
}

export default CreateItem; 
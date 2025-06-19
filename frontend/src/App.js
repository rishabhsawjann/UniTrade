import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';
import CreateItem from './components/CreateItem';
import Footer from './components/Footer';
import MyListings from './components/MyListings';
import Welcome from './components/Welcome';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const token = localStorage.getItem('token');
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={token ? <Home /> : <Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/items" element={<ItemList />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/my-listings" element={<PrivateRoute><MyListings /></PrivateRoute>} />
            <Route path="/create-item" element={<PrivateRoute><CreateItem /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

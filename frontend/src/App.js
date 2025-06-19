import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ItemList from './components/ItemList';
import ItemDetail from './components/ItemDetail';
import CreateItem from './components/CreateItem';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/items" element={<ItemList />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/create-item" element={<CreateItem />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

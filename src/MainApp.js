// src/MainApp.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Budget from './pages/Budget';
import Calendar from './pages/Calendar';
import CreateEvent from './pages/CreateEvent';
import Contact from './pages/Contact';
import About from './pages/About';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MisEventos from './pages/MisEventos';
import Profile from './pages/Profile';
import Supplies from './pages/Supplies';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ArchivedEvents from './pages/ArchivedEvents'; 
import EventDetail from './pages/EventDetail'; 

function PrivateRoute({ element }) {
  const { currentUser } = useAuth();

  // Si el usuario no está autenticado, redirige al login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Si el usuario está autenticado, muestra la ruta solicitada
  return element;
}

function MainApp() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/budget" element={<PrivateRoute element={<Budget />} />} />
              <Route path="/calendar" element={<PrivateRoute element={<Calendar />} />} />
              <Route path="/create-event" element={<PrivateRoute element={<CreateEvent />} />} />
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<PrivateRoute element={<MisEventos />} />} />
              <Route path="/event/:eventId" element={<PrivateRoute element={<EventDetail />} />} /> 
              <Route path="/archived-events" element={<PrivateRoute element={<ArchivedEvents />} />} /> 
              <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
              <Route path="/supplies" element={<PrivateRoute element={<Supplies />} />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default MainApp;

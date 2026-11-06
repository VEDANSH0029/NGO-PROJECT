import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Volunteer from './pages/Volunteer';
import Events from './pages/Events';
import Donate from './pages/Donate';
import Impact from './pages/Impact';
import Admin from './pages/Admin';

function PageManager() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);

    const path = location.pathname.toLowerCase();
    if (path.includes('about')) {
      document.title = "About | HopeConnect";
    } else if (path.includes('volunteer')) {
      document.title = "Volunteer | HopeConnect";
    } else if (path.includes('events')) {
      document.title = "Events | HopeConnect";
    } else if (path.includes('donate')) {
      document.title = "Donate | HopeConnect NGO";
    } else if (path.includes('impact')) {
      document.title = "Impact | HopeConnect";
    } else if (path.includes('admin')) {
      document.title = "Admin | HopeConnect";
    } else {
      document.title = "Home | HopeConnect";
    }
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <PageManager />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/about.html" element={<About />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/volunteer.html" element={<Volunteer />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events.html" element={<Events />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/donate.html" element={<Donate />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/impact.html" element={<Impact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin.html" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}


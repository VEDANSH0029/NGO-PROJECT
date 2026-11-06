import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <header>
      <nav className="navbar">
        <Link className="brand" to="/">HopeConnect NGO</Link>
        <div className="nav-links">
          <Link to="/" aria-current={location.pathname === '/' ? 'page' : undefined}>Home</Link>
          <Link to="/about" aria-current={location.pathname === '/about' ? 'page' : undefined}>About</Link>
          <Link to="/volunteer" aria-current={location.pathname === '/volunteer' ? 'page' : undefined}>Volunteer</Link>
          <Link to="/events" aria-current={location.pathname === '/events' ? 'page' : undefined}>Events</Link>
          <Link to="/donate" aria-current={location.pathname === '/donate' ? 'page' : undefined}>Donate</Link>
          <Link to="/impact" aria-current={location.pathname === '/impact' ? 'page' : undefined}>Impact</Link>
          <Link to="/admin" aria-current={location.pathname === '/admin' ? 'page' : undefined}>Admin</Link>
        </div>
      </nav>
    </header>
  );
}


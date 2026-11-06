import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../services/eventService';

export default function Home() {
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    fetchEvents().then(data => {
      if (data && data.length > 0) {
        setFeaturedEvents(data.slice(0, 3));
      }
    });
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <h1>Together We Can Make a Difference</h1>
        <p>Connecting volunteers, supporters and communities for positive change.</p>
        <Link className="btn" to="/volunteer">Become a Volunteer</Link>
        <Link className="btn btn-light" to="/donate">Support Us</Link>
      </section>

      {/* Welcome Section */}
      <section className="section">
        <h2>Welcome to HopeConnect</h2>
        <p className="intro">A student-built NGO outreach and support management prototype.</p>
        <div className="cards">
          <article className="card">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80"
              alt="Volunteers smiling"
              className="card-img"
            />
            <h3>Volunteer</h3>
            <p>Join community activities, teach children, and support local drives.</p>
            <Link to="/volunteer">Register →</Link>
          </article>

          <article className="card">
            <img
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"
              alt="Hands holding green sapling"
              className="card-img"
            />
            <h3>Events</h3>
            <p>Explore upcoming plantation, healthcare and educational camps.</p>
            <Link to="/events">See events →</Link>
          </article>

          <article className="card">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80"
              alt="Smiling children"
              className="card-img"
            />
            <h3>Impact</h3>
            <p>Learn about our targets, verified contributions and SDG goals.</p>
            <Link to="/impact">View targets →</Link>
          </article>
        </div>

        {/* How HopeConnect Works */}
        <h2 style={{ marginTop: '70px' }}>How HopeConnect Works</h2>
        <p className="intro">A transparent digital bridge between civil society, active volunteers and community drives.</p>
        <div className="cards">
          <article className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>🔍</span>
            <h3>1. Discover Causes</h3>
            <p>Browse verified community drives across environmental, healthcare and education domains.</p>
          </article>
          <article className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>🤝</span>
            <h3>2. Apply &amp; Pledge</h3>
            <p>Apply with your skills or record support pledges with verified receipt tracking.</p>
          </article>
          <article className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📊</span>
            <h3>3. Realtime Governance</h3>
            <p>Administrators verify submissions and coordinate ground volunteer deployments.</p>
          </article>
        </div>

        {/* Featured Upcoming Drives from Supabase */}
        {featuredEvents.length > 0 && (
          <>
            <h2 style={{ marginTop: '70px' }}>Upcoming Featured Drives</h2>
            <p className="intro">Live community programs currently open for volunteer registration.</p>
            <div className="cards">
              {featuredEvents.map((evt, idx) => (
                <article key={evt.id || idx} className="card">
                  {evt.image_url && (
                    <img src={evt.image_url} alt={evt.title} className="card-img" />
                  )}
                  <span className="pill-tag">{evt.status || 'Upcoming'}</span>
                  <h3>{evt.title}</h3>
                  <p style={{ fontSize: '14px', color: '#0369a1', fontWeight: 600 }}>
                    📅 {evt.date} • 📍 {evt.place}
                  </p>
                  <p style={{ fontSize: '14px', color: '#526477' }}>{evt.description}</p>
                  <Link to="/events" style={{ marginTop: 'auto' }}>View details &amp; Register →</Link>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Community Volunteer Stories */}
        <h2 style={{ marginTop: '70px' }}>Volunteer Voices</h2>
        <p className="intro">Experiences shared by community volunteers. <span className="demo-label" style={{ fontSize: '11px', padding: '2px 8px' }}>SAMPLE STORIES</span></p>
        <div className="cards">
          <article className="card">
            <p style={{ fontStyle: 'italic', color: '#334155' }}>
              "Teaching basic computer literacy at the Jaipur slum center was eye-opening. Seeing kids write their names digitally was pure joy."
            </p>
            <strong style={{ color: '#075985', display: 'block', marginTop: '12px' }}>— Rohan Sharma</strong>
            <small style={{ color: '#64748b' }}>Weekend Teaching Volunteer, Delhi</small>
          </article>
          <article className="card">
            <p style={{ fontStyle: 'italic', color: '#334155' }}>
              "We planted over 150 indigenous saplings in Sanjay Van. The coordination and safety gear provided by the NGO team was top-notch."
            </p>
            <strong style={{ color: '#075985', display: 'block', marginTop: '12px' }}>— Ananya Deshmukh</strong>
            <small style={{ color: '#64748b' }}>Green Drive Lead, Mumbai</small>
          </article>
          <article className="card">
            <p style={{ fontStyle: 'italic', color: '#334155' }}>
              "The healthcare camp in Civil Lines provided free eye checkups and spectacles to 85 elderly residents. A truly fulfilling weekend."
            </p>
            <strong style={{ color: '#075985', display: 'block', marginTop: '12px' }}>— Vikram Malhotra</strong>
            <small style={{ color: '#64748b' }}>Medical Volunteer, Bengaluru</small>
          </article>
        </div>
      </section>
    </main>
  );
}

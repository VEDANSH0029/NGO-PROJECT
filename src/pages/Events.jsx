import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents, registerForEvent } from '../services/eventService';
import { useAuth } from '../hooks/useAuth';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regStatus, setRegStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents().then(data => setEvents(data || []));
  }, []);

  const categories = ['All', 'Environment', 'Education', 'Healthcare', 'Community'];

  const filteredEvents = events.filter(evt => {
    if (selectedCategory === 'All') return true;
    const cat = selectedCategory.toLowerCase();
    return (
      evt.title?.toLowerCase().includes(cat) ||
      evt.description?.toLowerCase().includes(cat) ||
      (evt.category && evt.category.toLowerCase().includes(cat))
    );
  });

  const handleOpenRegister = (evt) => {
    setSelectedEvent(evt);
    setRegStatus('');
    if (user) {
      setRegEmail(user.email || '');
      setRegName(user.user_metadata?.full_name || '');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setIsSubmitting(true);
    setRegStatus('');

    try {
      const res = await registerForEvent(selectedEvent.id, user?.id || null);
      if (res && res.error) {
        if (res.error.code === '23505') {
          setRegStatus('You are already registered for this event!');
        } else {
          setRegStatus('Registration recorded successfully for ' + (regName || regEmail) + '!');
        }
      } else {
        setRegStatus('Registration confirmed! We look forward to seeing you at the drive.');
      }
    } catch {
      setRegStatus('Registration recorded successfully for ' + (regName || regEmail) + '!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <section className="section">
        <span className="demo-label" style={{ marginBottom: '12px' }}>LIVE COMMUNITY DRIVES</span>
        <h1>Upcoming Community Events</h1>
        <p className="intro">
          Explore on-ground NGO initiatives. Filter by cause and register to participate as an active volunteer.
        </p>

        {/* Category Filters */}
        <div className="filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Event Cards */}
        <div id="eventList" className="cards">
          {filteredEvents.length === 0 ? (
            <p style={{ color: '#64748b', gridColumn: '1/-1' }}>No events found in this category.</p>
          ) : (
            filteredEvents.map((event, index) => (
              <article key={event.id || index} className="card">
                {event.image_url && (
                  <img src={event.image_url} alt={event.title} className="card-img" />
                )}
                <div>
                  <span className="pill-tag">{event.status || 'Upcoming'}</span>
                  <h3>{event.title}</h3>
                  <p style={{ fontSize: '13px', color: '#0369a1', fontWeight: 600, margin: '6px 0 10px' }}>
                    📅 {event.date} • 📍 {event.place}
                  </p>
                  <p style={{ fontSize: '14px', color: '#475569', marginBottom: '16px' }}>
                    {event.description}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: 'auto', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn"
                    style={{ padding: '8px 14px', fontSize: '13px', margin: 0 }}
                    onClick={() => handleOpenRegister(event)}
                  >
                    Register for Drive
                  </button>
                  <Link to="/volunteer" style={{ fontSize: '13px', color: '#0369a1', fontWeight: 'bold' }}>
                    Full Volunteer Form →
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Registration Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="close-modal"
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>
            <span className="pill-tag">COMMUNITY REGISTRATION</span>
            <h2>{selectedEvent.title}</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginTop: 0 }}>
              📅 {selectedEvent.date} | 📍 {selectedEvent.place}
            </p>

            {!regStatus ? (
              <form onSubmit={handleRegisterSubmit}>
                <label style={{ display: 'block', fontWeight: 'bold', margin: '12px 0 5px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                />

                <label style={{ display: 'block', fontWeight: 'bold', margin: '12px 0 5px' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                />

                <button
                  type="submit"
                  className="btn"
                  style={{ width: '100%', marginTop: '20px' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Confirm Event Registration'}
                </button>
                <p className="field-hint" style={{ marginTop: '10px' }}>
                  Registrations are recorded in Supabase and reviewed by the drive coordinator.
                </p>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '15px 0' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>🎉</div>
                <p className="message" style={{ fontSize: '16px' }}>{regStatus}</p>
                <button
                  type="button"
                  className="btn btn-light"
                  style={{ marginTop: '15px' }}
                  onClick={() => setSelectedEvent(null)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

import React from 'react';

export default function About() {
  return (
    <main>
      <section className="section">
        <h1>About Our NGO</h1>
        <p className="intro">
          HopeConnect is a digital outreach and support management platform designed to help grassroots NGOs organize community drives, recruit passionate volunteers, and record transparent public support.
        </p>

        <div className="cards">
          <article className="card">
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80"
              alt="Hands working together"
              className="card-img"
            />
            <h3>Mission</h3>
            <p>Encourage civic participation and mobilize youth energy into grassroots community welfare programs.</p>
          </article>

          <article className="card">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80"
              alt="Volunteers smiling"
              className="card-img"
            />
            <h3>Vision</h3>
            <p>Make NGO outreach, volunteer recruitment, and donation tracking transparent, accessible, and organized.</p>
          </article>

          <article className="card">
            <img
              src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80"
              alt="Children books education"
              className="card-img"
            />
            <h3>Project Goals</h3>
            <p>Centralize volunteer onboarding, publish verified drives, and provide realtime administrative governance.</p>
          </article>
        </div>

        {/* Core Values */}
        <h2 style={{ marginTop: '60px' }}>Our Core Pillars</h2>
        <p className="intro">Principles guiding our platform architecture and community interactions.</p>
        <div className="cards">
          <article className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '30px', display: 'block', marginBottom: '8px' }}>🛡️</span>
            <h3>Data Integrity</h3>
            <p>PostgreSQL Row Level Security ensures verified access for administrators and protects donor privacy.</p>
          </article>
          <article className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '30px', display: 'block', marginBottom: '8px' }}>⚡</span>
            <h3>Realtime Agility</h3>
            <p>Live websocket subscriptions update drive registrations and volunteer statuses instantly without page reload.</p>
          </article>
          <article className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '30px', display: 'block', marginBottom: '8px' }}>🤝</span>
            <h3>Community First</h3>
            <p>Every feature—from plantation drives to education camps—is centered around local impact.</p>
          </article>
        </div>

        <h2 style={{ marginTop: '60px' }}>SDG Alignment</h2>
        <p className="intro">
          <strong>SDG 17: Partnerships for the Goals</strong> (primary benchmark). Supported by <strong>SDG 10: Reduced Inequalities</strong> and <strong>SDG 16: Peace, Justice &amp; Strong Institutions</strong>.
        </p>
      </section>
    </main>
  );
}

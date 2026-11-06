import React, { useState, useEffect } from 'react';
import { fetchVolunteers } from '../services/volunteerService';
import { fetchEvents } from '../services/eventService';
import { fetchDonationStats } from '../services/donationService';

export default function Impact() {
  const [stats, setStats] = useState({
    volunteerCount: 0,
    eventCount: 0,
    verifiedCount: 0,
    verifiedAmount: 0
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [vols, evts, donStats] = await Promise.all([
          fetchVolunteers(),
          fetchEvents(),
          fetchDonationStats()
        ]);
        setStats({
          volunteerCount: vols?.length || 0,
          eventCount: evts?.length || 0,
          verifiedCount: donStats?.verifiedCount || 0,
          verifiedAmount: donStats?.verifiedAmount || 0
        });
      } catch (err) {
        console.error('Error loading impact stats:', err);
      }
    }
    loadStats();
  }, []);

  return (
    <main>
      <section className="section">
        <h1>Expected Project Impact</h1>
        <p className="intro">
          Realtime database metrics and target progress across active community drives.
        </p>

        {/* Live Counters */}
        <div className="cards">
          <article className="stat">
            <strong>{stats.volunteerCount}</strong>
            <span>Active Volunteers</span>
          </article>
          <article className="stat">
            <strong>{stats.eventCount}</strong>
            <span>Community Events</span>
          </article>
          <article className="stat">
            <strong>₹{stats.verifiedAmount.toLocaleString('en-IN')}</strong>
            <span>Verified Funds Raised</span>
          </article>
          <article className="stat">
            <strong>60%</strong>
            <span>Expected Engagement Growth</span>
          </article>
          <article className="stat">
            <strong>50%</strong>
            <span>Reduction in Admin Workload</span>
          </article>
        </div>

        {/* Goal Progress Section */}
        <h2 style={{ marginTop: '60px' }}>Target vs Actual Progress</h2>
        <p className="intro">Tracking current achievements against 2026 educational project targets.</p>

        <div className="cards">
          <article className="card" style={{ width: '310px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>Volunteer Target</strong>
              <span style={{ color: '#0284c7', fontWeight: 'bold' }}>{stats.volunteerCount} / 500</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (stats.volunteerCount / 500) * 100)}%`, height: '100%', background: '#0284c7' }}></div>
            </div>
            <small style={{ color: '#64748b', display: 'block', marginTop: '6px' }}>Target: 500 verified community volunteers</small>
          </article>

          <article className="card" style={{ width: '310px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>Annual Events</strong>
              <span style={{ color: '#0284c7', fontWeight: 'bold' }}>{stats.eventCount} / 20</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (stats.eventCount / 20) * 100)}%`, height: '100%', background: '#059669' }}></div>
            </div>
            <small style={{ color: '#64748b', display: 'block', marginTop: '6px' }}>Target: 20 community welfare programs</small>
          </article>

          <article className="card" style={{ width: '310px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>Funds Target</strong>
              <span style={{ color: '#0284c7', fontWeight: 'bold' }}>₹{stats.verifiedAmount.toLocaleString('en-IN')} / ₹50,000</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (stats.verifiedAmount / 50000) * 100)}%`, height: '100%', background: '#0284c7' }}></div>
            </div>
            <small style={{ color: '#64748b', display: 'block', marginTop: '6px' }}>Target: ₹50,000 for learning &amp; medical supplies</small>
          </article>
        </div>

        {/* SDG Alignment */}
        <h2 style={{ marginTop: '60px' }}>UN Sustainable Development Goals (SDG) Alignment</h2>
        <p className="intro">Direct alignment with global development benchmarks.</p>
        <div className="cards">
          <article className="card" style={{ borderLeft: '4px solid #166534' }}>
            <span className="pill-tag" style={{ background: '#dcfce7', color: '#166534' }}>SDG 17 (PRIMARY)</span>
            <h3>Partnerships for the Goals</h3>
            <p>Mobilizing collaborative partnerships between citizen volunteers, students, and community sponsors.</p>
          </article>

          <article className="card" style={{ borderLeft: '4px solid #0369a1' }}>
            <span className="pill-tag" style={{ background: '#e0f2fe', color: '#0369a1' }}>SDG 10 (SUPPORTING)</span>
            <h3>Reduced Inequalities</h3>
            <p>Bringing free digital literacy and health resources to historically underserved urban and rural communities.</p>
          </article>

          <article className="card" style={{ borderLeft: '4px solid #854d0e' }}>
            <span className="pill-tag" style={{ background: '#fef3c7', color: '#854d0e' }}>SDG 16 (SUPPORTING)</span>
            <h3>Peace, Justice &amp; Strong Institutions</h3>
            <p>Ensuring transparent, accountable, and auditable record management for civil society organizations.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

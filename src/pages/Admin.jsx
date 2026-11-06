import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import useRealtimeTable from '../hooks/useRealtime';
import {
  fetchVolunteers,
  updateVolunteerStatus,
  deleteVolunteer
} from '../services/volunteerService';
import {
  fetchDonations,
  updateDonationStatus
} from '../services/donationService';
import {
  fetchEvents,
  createEvent,
  deleteEvent
} from '../services/eventService';
import { logAdminAction } from '../services/adminService';

export default function Admin() {
  const { user, isAdmin, signIn, signOut } = useAuth();

  const [authMode, setAuthMode] = useState('adminLogin'); // 'adminLogin' | 'volunteerLogin' | 'register'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [volunteers, setVolunteers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [events, setEvents] = useState([]);

  // Volunteer & Donation Filtering
  const [volFilter, setVolFilter] = useState('All');
  const [volSearch, setVolSearch] = useState('');
  const [donFilter, setDonFilter] = useState('All');

  // New Event Form State
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    place: '',
    description: '',
    status: 'Upcoming'
  });

  const loadDashboardData = useCallback(async () => {
    try {
      const [vols, dons, evts] = await Promise.all([
        fetchVolunteers(),
        fetchDonations(),
        fetchEvents()
      ]);
      setVolunteers(vols || []);
      setDonations(dons || []);
      setEvents(evts || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    if (user && isAdmin) {
      loadDashboardData();
    }
  }, [user, isAdmin, loadDashboardData]);

  // Realtime subscriptions for admin tables
  useRealtimeTable('volunteers', () => {
    if (user && isAdmin) loadDashboardData();
  });

  useRealtimeTable('donations', () => {
    if (user && isAdmin) loadDashboardData();
  });

  useRealtimeTable('events', () => {
    if (user && isAdmin) loadDashboardData();
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setAuthSuccess('');
    setActionLoading(true);

    try {
      // Map 'admin' shorthand to admin email if entered
      let email = emailInput.trim();
      if (email === 'admin') email = 'admin@hopeconnect.org';

      const { data, error } = await signIn({
        email,
        password: passwordInput
      });

      if (error || !data?.user) {
        setLoginError(error?.message || 'Incorrect email or password.');
      } else {
        const userIsAdmin = data.user.app_metadata?.role === 'admin';
        if (!userIsAdmin && authMode === 'adminLogin') {
          setLoginError('Access denied: This account does not have administrative privileges.');
        } else {
          setEmailInput('');
          setPasswordInput('');
          loadDashboardData();
        }
      }
    } catch (err) {
      setLoginError(err.message || 'An error occurred during login.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setVolunteers([]);
    setDonations([]);
    setEvents([]);
    setLoginError('');
  };

  // Volunteer actions
  const handleApproveVolunteer = async (id) => {
    const res = await updateVolunteerStatus(id, 'Approved');
    if (res.volunteer) {
      await logAdminAction('APPROVE_VOLUNTEER', 'volunteers', id);
      loadDashboardData();
    } else {
      alert('Failed to approve volunteer. Please check RLS permissions.');
    }
  };

  const handleRejectVolunteer = async (id) => {
    const res = await updateVolunteerStatus(id, 'Rejected');
    if (res.volunteer) {
      await logAdminAction('REJECT_VOLUNTEER', 'volunteers', id);
      loadDashboardData();
    } else {
      alert('Failed to reject volunteer. Please check RLS permissions.');
    }
  };

  const handleDeleteVolunteer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this volunteer application?')) return;
    const res = await deleteVolunteer(id);
    if (res.success) {
      await logAdminAction('DELETE_VOLUNTEER', 'volunteers', id);
      loadDashboardData();
    } else {
      alert('Failed to delete volunteer.');
    }
  };

  // Donation actions
  const handleVerifyDonation = async (id) => {
    const ref = prompt('Enter payment transaction reference (optional):', 'GATEWAY-' + Date.now());
    const res = await updateDonationStatus(id, 'Verified Paid', ref);
    if (res.donation) {
      await logAdminAction('VERIFY_DONATION', 'donations', id);
      loadDashboardData();
    } else {
      alert('Failed to verify donation.');
    }
  };

  // Event actions
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.place || !newEvent.description) {
      alert('Please fill out all event fields.');
      return;
    }
    const res = await createEvent(newEvent);
    if (res.event) {
      await logAdminAction('CREATE_EVENT', 'events', res.event.id);
      setNewEvent({ title: '', date: '', place: '', description: '', status: 'Upcoming' });
      setShowEventForm(false);
      loadDashboardData();
    } else {
      alert('Failed to create event. Please verify admin privileges.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    const res = await deleteEvent(id);
    if (res.success) {
      await logAdminAction('DELETE_EVENT', 'events', id);
      loadDashboardData();
    } else {
      alert('Failed to delete event.');
    }
  };

  // Stats calculation
  const pendingVolunteers = volunteers.filter(v => (v.status || 'Pending') === 'Pending').length;
  const verifiedDonations = donations.filter(d => d.payment_status === 'Verified Paid');
  const verifiedAmount = verifiedDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0);

  const displayedVolunteers = volunteers.filter(v => {
    const matchesStatus = volFilter === 'All' || (v.status || 'Pending') === volFilter;
    const matchesSearch = !volSearch || (
      v.name?.toLowerCase().includes(volSearch.toLowerCase()) ||
      v.city?.toLowerCase().includes(volSearch.toLowerCase()) ||
      v.interest?.toLowerCase().includes(volSearch.toLowerCase()) ||
      v.email?.toLowerCase().includes(volSearch.toLowerCase())
    );
    return matchesStatus && matchesSearch;
  });

  const displayedDonations = donations.filter(d => {
    if (donFilter === 'All') return true;
    return d.payment_status === donFilter;
  });

  return (
    <main>
      <section className="section">
        <h1>Admin Portal</h1>
        <p className="intro">
          HopeConnect NGO Administration &amp; Realtime Outreach Management System powered by Supabase PostgreSQL.
        </p>

        {!user || !isAdmin ? (
          <div id="adminLoginBox" className="form-box">
            <h2>Admin Login</h2>
            <form id="adminLoginForm" onSubmit={handleLoginSubmit}>
              <label htmlFor="adminUsername">Email or Username</label>
              <input
                id="adminUsername"
                type="text"
                autoComplete="username"
                required
                placeholder="admin@hopeconnect.org or admin"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />

              <label htmlFor="adminPassword">Password</label>
              <input
                id="adminPassword"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />

              <button type="submit" className="btn" disabled={actionLoading}>
                {actionLoading ? 'Verifying...' : 'Log In as Administrator'}
              </button>

              {loginError && (
                <p id="loginMessage" className="error-message" role="alert" style={{ marginTop: '14px' }}>
                  {loginError}
                </p>
              )}
              {authSuccess && (
                <p className="message" role="status" style={{ marginTop: '14px' }}>
                  {authSuccess}
                </p>
              )}
            </form>
            <p className="field-hint" style={{ marginTop: '16px' }}>
              🔑 Secured with Supabase Row Level Security &amp; App Metadata verification.<br />
              Default Admin: <strong>admin@hopeconnect.org</strong> / <strong>Admin@123456!</strong>
            </p>
          </div>
        ) : (
          <div id="adminDashboard">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#075985' }}>
                  Logged in as Administrator: {user.email}
                </p>
                <span className="field-hint">Realtime database connection active</span>
              </div>
              <button id="logoutBtn" type="button" className="btn" onClick={handleLogout}>
                Log Out
              </button>
            </div>

            {/* Live Stats */}
            <div className="cards" style={{ marginBottom: '35px' }}>
              <article className="stat">
                <strong id="totalVolunteers">{volunteers.length}</strong>
                <span>Total Applications</span>
              </article>
              <article className="stat">
                <strong>{pendingVolunteers}</strong>
                <span>Pending Reviews</span>
              </article>
              <article className="stat">
                <strong id="totalEvents">{events.length}</strong>
                <span>Active Events</span>
              </article>
              <article className="stat">
                <strong id="totalDonations">{donations.length}</strong>
                <span>Total Pledges</span>
              </article>
              <article className="stat">
                <strong>{verifiedDonations.length}</strong>
                <span>Verified Paid</span>
              </article>
              <article className="stat">
                <strong>₹{verifiedAmount.toLocaleString('en-IN')}</strong>
                <span>Verified Funds</span>
              </article>
            </div>

            {/* Volunteer Applications */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginTop: '30px', marginBottom: '15px' }}>
              <h2 style={{ margin: 0 }}>Volunteer Applications ({displayedVolunteers.length})</h2>
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search name, city, skills..."
                  value={volSearch}
                  onChange={e => setVolSearch(e.target.value)}
                  style={{ padding: '7px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', width: '220px' }}
                />
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['All', 'Pending', 'Approved', 'Rejected'].map(st => (
                    <button
                      key={st}
                      type="button"
                      className={`filter-btn ${volFilter === st ? 'active' : ''}`}
                      style={{ padding: '5px 12px', fontSize: '12px' }}
                      onClick={() => setVolFilter(st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Age</th>
                    <th>City</th>
                    <th>Interest</th>
                    <th>Skills</th>
                    <th>Availability</th>
                    <th>Experience</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="volunteerTable">
                  {displayedVolunteers.length === 0 ? (
                    <tr>
                      <td colSpan="12" style={{ textAlign: 'center', padding: '20px' }}>
                        No volunteer applications match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    displayedVolunteers.map((person) => (
                      <tr key={person.id}>
                        <td><strong>{person.name}</strong></td>
                        <td>{person.email}</td>
                        <td>{person.phone}</td>
                        <td>{person.age || '—'}</td>
                        <td>{person.city || '—'}</td>
                        <td>{person.interest}</td>
                        <td>{person.skills || '—'}</td>
                        <td>{person.availability || '—'}</td>
                        <td>{person.experience || '—'}</td>
                        <td style={{ maxWidth: '250px' }}>{person.reason || '—'}</td>
                        <td>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            backgroundColor: person.status === 'Approved' ? '#dcfce7' : person.status === 'Rejected' ? '#fee2e2' : '#fef9c3',
                            color: person.status === 'Approved' ? '#166534' : person.status === 'Rejected' ? '#991b1b' : '#854d0e'
                          }}>
                            {person.status || 'Pending'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {person.status !== 'Approved' && (
                              <button
                                type="button"
                                className="outline-btn"
                                style={{ padding: '4px 8px', fontSize: '12px', color: '#166534', borderColor: '#166534' }}
                                onClick={() => handleApproveVolunteer(person.id)}
                              >
                                Approve
                              </button>
                            )}
                            {person.status !== 'Rejected' && (
                              <button
                                type="button"
                                className="outline-btn"
                                style={{ padding: '4px 8px', fontSize: '12px', color: '#991b1b', borderColor: '#991b1b' }}
                                onClick={() => handleRejectVolunteer(person.id)}
                              >
                                Reject
                              </button>
                            )}
                            <button
                              type="button"
                              className="outline-btn"
                              style={{ padding: '4px 8px', fontSize: '12px', color: '#475569', borderColor: '#cbd5e1' }}
                              onClick={() => handleDeleteVolunteer(person.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Donation Management */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginTop: '40px', marginBottom: '15px' }}>
              <h2 style={{ margin: 0 }}>Donation Pledges &amp; Payments ({displayedDonations.length})</h2>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['All', 'Verified Paid', 'Pledge Recorded'].map(st => (
                  <button
                    key={st}
                    type="button"
                    className={`filter-btn ${donFilter === st ? 'active' : ''}`}
                    style={{ padding: '5px 12px', fontSize: '12px' }}
                    onClick={() => setDonFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Donor Name</th>
                    <th>Email</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Reference</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="donationTable">
                  {displayedDonations.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                        No donation pledges match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    displayedDonations.map((pledge) => (
                      <tr key={pledge.id}>
                        <td><strong>{pledge.donor_name || pledge.name}</strong></td>
                        <td>{pledge.donor_email || pledge.email}</td>
                        <td><strong>₹{Number(pledge.amount).toLocaleString('en-IN')}</strong></td>
                        <td>{pledge.payment_method || pledge.method || 'UPI'}</td>
                        <td>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '12px',
                            backgroundColor: pledge.payment_status === 'Verified Paid' ? '#dcfce7' : '#e0f2fe',
                            color: pledge.payment_status === 'Verified Paid' ? '#166534' : '#0369a1'
                          }}>
                            {pledge.payment_status || 'Pledge Recorded'}
                          </span>
                        </td>
                        <td><small>{pledge.transaction_reference || '—'}</small></td>
                        <td>
                          {pledge.payment_status !== 'Verified Paid' ? (
                            <button
                              type="button"
                              className="outline-btn"
                              style={{ padding: '4px 8px', fontSize: '12px' }}
                              onClick={() => handleVerifyDonation(pledge.id)}
                            >
                              Mark Verified
                            </button>
                          ) : (
                            <span style={{ color: '#166534', fontWeight: 'bold', fontSize: '13px' }}>✓ Verified</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Event Management */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginTop: '40px' }}>
              <h2>Event Management ({events.length})</h2>
              <button
                type="button"
                className="btn"
                style={{ margin: 0 }}
                onClick={() => setShowEventForm(!showEventForm)}
              >
                {showEventForm ? 'Cancel Event' : '+ Add New Event'}
              </button>
            </div>

            {showEventForm && (
              <form onSubmit={handleCreateEvent} className="form-box wide-form" style={{ marginTop: '20px', marginBottom: '25px' }}>
                <h3>Add New Community Event</h3>
                <label>Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Clothes Donation Drive"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                />
                <div className="two-fields">
                  <div>
                    <label>Date *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 18 December 2026"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Location / Venue *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. City Central Auditorium"
                      value={newEvent.place}
                      onChange={(e) => setNewEvent({ ...newEvent, place: e.target.value })}
                    />
                  </div>
                </div>
                <label>Description *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the objective and how volunteers can participate..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
                <button type="submit" className="btn">Publish Event to Public Website</button>
              </form>
            )}

            <div className="table-wrap" style={{ marginTop: '15px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Date</th>
                    <th>Place</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((evt) => (
                    <tr key={evt.id || evt.title}>
                      <td><strong>{evt.title}</strong></td>
                      <td>{evt.date}</td>
                      <td>{evt.place}</td>
                      <td>{evt.description}</td>
                      <td>{evt.status || 'Upcoming'}</td>
                      <td>
                        {evt.id && (
                          <button
                            type="button"
                            className="outline-btn"
                            style={{ padding: '4px 8px', fontSize: '12px', color: '#991b1b', borderColor: '#991b1b' }}
                            onClick={() => handleDeleteEvent(evt.id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

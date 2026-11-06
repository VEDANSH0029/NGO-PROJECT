import React, { useState } from 'react';
import { submitVolunteer } from '../services/volunteerService';
import { supabase } from '../lib/supabaseClient';

export default function Volunteer() {
  const [formData, setFormData] = useState({
    volName: '',
    volEmail: '',
    volPhone: '',
    volAge: '',
    volCity: '',
    volInterest: '',
    volSkills: '',
    volAvailability: '',
    volExperience: '',
    volReason: '',
    volAgree: false
  });

  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Status Tracker State
  const [trackEmail, setTrackEmail] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState('');

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = formData.volName.trim();
    const email = formData.volEmail.trim();
    const phone = formData.volPhone.trim();
    const age = Number(formData.volAge);
    const city = formData.volCity.trim();
    const interest = formData.volInterest;
    const skills = formData.volSkills.trim();
    const availability = formData.volAvailability;
    const experience = formData.volExperience;
    const reason = formData.volReason.trim();
    const agreed = formData.volAgree;

    if (
      !name || !email || !/^[0-9]{10}$/.test(phone) || age < 16 || age > 100 ||
      !city || !interest || !skills || !availability || !experience || reason.length < 30 || !agreed
    ) {
      alert("Please complete all required fields. Your reason must be at least 30 characters.");
      return;
    }

    setIsSubmitting(true);
    const newVolunteer = {
      name,
      email,
      phone,
      age,
      city,
      interest,
      skills,
      availability,
      experience,
      reason
    };

    const res = await submitVolunteer(newVolunteer);
    setIsSubmitting(false);

    if (res && res.error) {
      alert("Submission error: " + res.error.message);
      return;
    }

    setMessage("Thank you! Your volunteer application has been submitted successfully to HopeConnect.");
    setFormData({
      volName: '',
      volEmail: '',
      volPhone: '',
      volAge: '',
      volCity: '',
      volInterest: '',
      volSkills: '',
      volAvailability: '',
      volExperience: '',
      volReason: '',
      volAgree: false
    });
  };

  const handleTrackStatus = async (e) => {
    e.preventDefault();
    if (!trackEmail.trim()) return;
    setTrackLoading(true);
    setTrackError('');
    setTrackResult(null);

    try {
      const { data, error } = await supabase
        .from('volunteers')
        .select('name, email, interest, status, admin_notes, created_at')
        .eq('email', trackEmail.trim().toLowerCase())
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      if (data && data.length > 0) {
        setTrackResult(data[0]);
      } else {
        setTrackError('No application found with email: ' + trackEmail);
      }
    } catch {
      // Fallback check localStorage
      const local = JSON.parse(localStorage.getItem('ngo_volunteers') || '[]');
      const found = local.find(v => v.email?.toLowerCase() === trackEmail.trim().toLowerCase());
      if (found) {
        setTrackResult(found);
      } else {
        setTrackError('No application found with email: ' + trackEmail);
      }
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <main>
      <section className="section">
        <h1>Join as a Volunteer</h1>
        <p className="intro">
          Be part of positive social change. Whether you teach kids, plant trees, or coordinate food camps, your skills matter.
        </p>

        {/* Benefits Cards */}
        <div className="cards" style={{ marginBottom: '40px' }}>
          <article className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '30px', display: 'block', marginBottom: '8px' }}>🎓</span>
            <h3>Skill Development</h3>
            <p>Hands-on leadership, team collaboration and real project management experience.</p>
          </article>
          <article className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '30px', display: 'block', marginBottom: '8px' }}>📜</span>
            <h3>Verified Certificate</h3>
            <p>Official recognition certificate from HopeConnect NGO acknowledging your drive hours.</p>
          </article>
          <article className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '30px', display: 'block', marginBottom: '8px' }}>🌱</span>
            <h3>Direct Impact</h3>
            <p>Make tangible, visible differences in education, tree cover, and community well-being.</p>
          </article>
        </div>

        {/* Volunteer Application Form */}
        <form id="volunteerForm" className="form-box wide-form" onSubmit={handleSubmit}>
          <h2>Personal Information</h2>
          <label htmlFor="volName">Full Name *</label>
          <input
            id="volName"
            maxLength={80}
            required
            value={formData.volName}
            onChange={handleChange}
            placeholder="e.g. Rohan Sharma"
          />
          <div className="two-fields">
            <div>
              <label htmlFor="volEmail">Email *</label>
              <input
                id="volEmail"
                type="email"
                required
                value={formData.volEmail}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="volPhone">Phone (10 digits) *</label>
              <input
                id="volPhone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                required
                value={formData.volPhone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>
          </div>
          <div className="two-fields">
            <div>
              <label htmlFor="volAge">Age *</label>
              <input
                id="volAge"
                type="number"
                min={16}
                max={100}
                required
                value={formData.volAge}
                onChange={handleChange}
                placeholder="21"
              />
            </div>
            <div>
              <label htmlFor="volCity">City *</label>
              <input
                id="volCity"
                maxLength={80}
                required
                value={formData.volCity}
                onChange={handleChange}
                placeholder="e.g. New Delhi"
              />
            </div>
          </div>

          <h2>Your Volunteering Interests</h2>
          <label htmlFor="volInterest">Area of Interest *</label>
          <select
            id="volInterest"
            required
            value={formData.volInterest}
            onChange={handleChange}
          >
            <option value="">Choose one</option>
            <option>Education</option>
            <option>Environment</option>
            <option>Healthcare</option>
            <option>Community Service</option>
            <option>Fundraising & Outreach</option>
          </select>

          <label htmlFor="volSkills">Skills you can contribute *</label>
          <input
            id="volSkills"
            maxLength={200}
            placeholder="e.g. Teaching, social media, organizing events, first aid"
            required
            value={formData.volSkills}
            onChange={handleChange}
          />

          <label htmlFor="volAvailability">When are you available? *</label>
          <select
            id="volAvailability"
            required
            value={formData.volAvailability}
            onChange={handleChange}
          >
            <option value="">Select availability</option>
            <option>Weekdays</option>
            <option>Weekends</option>
            <option>Flexible</option>
          </select>

          <label htmlFor="volExperience">Previous volunteering experience *</label>
          <select
            id="volExperience"
            required
            value={formData.volExperience}
            onChange={handleChange}
          >
            <option value="">Select one</option>
            <option>No experience yet</option>
            <option>Less than 1 year</option>
            <option>1–3 years</option>
            <option>More than 3 years</option>
          </select>

          <label htmlFor="volReason">Why are you interested in volunteering? * (at least 30 characters)</label>
          <textarea
            id="volReason"
            rows={5}
            minLength={30}
            maxLength={1000}
            required
            placeholder="Explain why you want to volunteer and what you hope to contribute to the community..."
            value={formData.volReason}
            onChange={handleChange}
          />
          <p className="field-hint">This answer is compulsory and will be reviewed by the NGO admin team.</p>

          <label className="check-label">
            <input
              type="checkbox"
              id="volAgree"
              required
              checked={formData.volAgree}
              onChange={handleChange}
            />{' '}
            I agree to follow the NGO's volunteer guidelines and understand this is an active community outreach platform. *
          </label>

          <button className="btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting to Supabase...' : 'Submit Volunteer Application'}
          </button>
          {message && <p id="volunteerMessage" className="message" role="status" style={{ marginTop: '16px' }}>{message}</p>}
        </form>

        {/* Live Application Status Checker */}
        <div className="form-box" style={{ marginTop: '50px', background: '#f8fafc' }}>
          <h2>🔍 Check Application Status</h2>
          <p className="field-hint" style={{ marginBottom: '15px' }}>
            Already applied? Enter your registered email to see your current review status.
          </p>
          <form onSubmit={handleTrackStatus}>
            <input
              type="email"
              required
              placeholder="Enter your registered email"
              value={trackEmail}
              onChange={e => setTrackEmail(e.target.value)}
            />
            <button type="submit" className="outline-btn" style={{ width: '100%', marginTop: '12px' }} disabled={trackLoading}>
              {trackLoading ? 'Checking...' : 'Check Status'}
            </button>
          </form>

          {trackError && (
            <p className="error-message" style={{ marginTop: '14px', fontSize: '14px' }}>
              {trackError}
            </p>
          )}

          {trackResult && (
            <div style={{ marginTop: '18px', padding: '15px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{trackResult.name}</strong>
                <span style={{
                  padding: '3px 9px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: trackResult.status === 'Approved' ? '#dcfce7' : trackResult.status === 'Rejected' ? '#fee2e2' : '#fef9c3',
                  color: trackResult.status === 'Approved' ? '#166534' : trackResult.status === 'Rejected' ? '#991b1b' : '#854d0e'
                }}>
                  {trackResult.status || 'Pending'}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '6px 0 0' }}>
                Interest: {trackResult.interest}
              </p>
              {trackResult.admin_notes && (
                <p style={{ fontSize: '13px', color: '#0369a1', margin: '6px 0 0', fontStyle: 'italic' }}>
                  Admin note: {trackResult.admin_notes}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

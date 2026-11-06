import React, { useState, useEffect } from 'react';
import { submitDonation, fetchDonations } from '../services/donationService';

export default function Donate() {
  const [amount, setAmount] = useState(500);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [method, setMethod] = useState('upi');
  const [upiApp, setUpiApp] = useState('Google Pay');
  const [copyStatus, setCopyStatus] = useState('');
  const [submittedPledge, setSubmittedPledge] = useState(null);
  const [recentPledges, setRecentPledges] = useState([]);

  useEffect(() => {
    fetchDonations().then(data => {
      if (data && data.length > 0) {
        setRecentPledges(data.slice(0, 4));
      }
    });
  }, [submittedPledge]);

  const formatMoney = (val) => "₹" + Number(val || 0).toLocaleString("en-IN");

  const getMethodLabel = () => {
    if (method === 'upi') return `${upiApp} (UPI)`;
    if (method === 'qr') return 'Scan QR (demo)';
    return 'Card (demo)';
  };

  const handleCopyUpi = async () => {
    const value = "demo@not-a-real-upi";
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus("Demo ID copied (not valid for payment).");
    } catch {
      setCopyStatus("Select the demo ID above to copy it manually.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = donorName.trim();
    const email = donorEmail.trim();
    const numAmount = Number(amount);

    if (!name || !email || !Number.isInteger(numAmount) || numAmount < 1 || numAmount > 1000000) {
      alert("Please enter valid donor details and an amount from ₹1 to ₹10,00,000.");
      return;
    }

    const methodLabel = method === "upi" ? `${upiApp} (UPI)` : method === "qr" ? "QR demo" : "Card demo";
    const donationData = {
      name,
      email,
      amount: numAmount,
      method: methodLabel,
      donor_message: donorMessage.trim(),
      status: "Demo pledge — unpaid"
    };

    const res = await submitDonation(donationData);
    if (res && res.error) {
      alert("Submission error: " + res.error.message);
      return;
    }

    const resultMsg = `${name}, your ₹${numAmount.toLocaleString("en-IN")} pledge via ${methodLabel} has been recorded.`;
    setSubmittedPledge(resultMsg);
  };

  const handleReset = () => {
    setSubmittedPledge(null);
    setDonorName('');
    setDonorEmail('');
    setDonorMessage('');
    setAmount(500);
    setMethod('upi');
    setUpiApp('Google Pay');
    setCopyStatus('');
  };

  const impactTiers = [
    { amt: 500, label: "📚 Books & Stationary for 2 kids" },
    { amt: 1000, label: "🌱 10 Indigenous Tree Saplings" },
    { amt: 2500, label: "🍲 Nutrition kits for 15 families" },
    { amt: 5000, label: "🏥 Rural Medical Camp Supplies" }
  ];

  return (
    <main className="checkout-page">
      <div className="checkout-heading">
        <span className="demo-label">STUDENT DEMO · NO REAL PAYMENTS</span>
        <h1>Make a difference today</h1>
        <p>Choose how you'd like to support our community programs across education, healthcare and green drives.</p>
      </div>

      {!submittedPledge ? (
        <form id="donationForm" className="checkout-layout" onSubmit={handleSubmit}>
          <div className="checkout-main">
            {/* Impact Tiers */}
            <section className="checkout-panel">
              <h2><span className="step">1</span> Choose donation amount</h2>
              <p className="muted">Select an impact tier or enter your custom amount.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                {impactTiers.map(tier => (
                  <div
                    key={tier.amt}
                    onClick={() => setAmount(tier.amt)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      border: amount === tier.amt ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      background: amount === tier.amt ? '#eaf7ff' : '#fff',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: amount === tier.amt ? '#0369a1' : '#334155'
                    }}
                  >
                    <span style={{ fontSize: '16px', display: 'block', fontWeight: 'bold' }}>₹{tier.amt.toLocaleString('en-IN')}</span>
                    {tier.label}
                  </div>
                ))}
              </div>

              <div className="amount-grid">
                {[100, 500, 1000, 2000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    className={`amount-choice ${Number(amount) === amt ? 'selected' : ''}`}
                    onClick={() => setAmount(amt)}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <label htmlFor="donationAmount" className="field-label">Donation amount (₹)</label>
              <input
                id="donationAmount"
                type="number"
                min="1"
                max="1000000"
                step="1"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </section>

            <section className="checkout-panel">
              <h2><span className="step">2</span> Your details</h2>
              <div className="field-grid">
                <div>
                  <label htmlFor="donorName" className="field-label">Full name *</label>
                  <input
                    id="donorName"
                    maxLength={80}
                    placeholder="Your name"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="donorEmail" className="field-label">Email address *</label>
                  <input
                    id="donorEmail"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                  />
                </div>
              </div>
              <label htmlFor="donorMessage" className="field-label">Message of support (optional)</label>
              <textarea
                id="donorMessage"
                rows={3}
                maxLength={250}
                placeholder="Share a word of encouragement for our volunteers..."
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
              />
            </section>

            <section className="checkout-panel">
              <h2><span className="step">3</span> Select payment method</h2>
              <p className="muted">Explore the payment experience. No bank or payment app is contacted.</p>
              <div className="payment-tabs" role="radiogroup" aria-label="Payment method">
                <label className="payment-tab">
                  <input
                    type="radio"
                    name="method"
                    value="upi"
                    checked={method === 'upi'}
                    onChange={() => setMethod('upi')}
                  />
                  <span>📱 UPI Apps</span>
                </label>
                <label className="payment-tab">
                  <input
                    type="radio"
                    name="method"
                    value="qr"
                    checked={method === 'qr'}
                    onChange={() => setMethod('qr')}
                  />
                  <span>▦ Scan QR</span>
                </label>
                <label className="payment-tab">
                  <input
                    type="radio"
                    name="method"
                    value="card"
                    checked={method === 'card'}
                    onChange={() => setMethod('card')}
                  />
                  <span>💳 Card</span>
                </label>
              </div>

              {method === 'upi' && (
                <div id="upiPanel" className="payment-detail">
                  <h3>Choose your UPI app</h3>
                  <div className="app-grid">
                    {[
                      { name: 'Google Pay', icon: 'G' },
                      { name: 'PhonePe', icon: 'P' },
                      { name: 'Paytm', icon: '₹' },
                      { name: 'BHIM', icon: 'B' }
                    ].map(app => (
                      <label key={app.name}>
                        <input
                          type="radio"
                          name="upiApp"
                          value={app.name}
                          checked={upiApp === app.name}
                          onChange={() => setUpiApp(app.name)}
                        />
                        <span>{app.icon}</span> {app.name}
                      </label>
                    ))}
                  </div>
                  <p className="muted small">In a real website, a verified payment gateway would open your chosen app.</p>
                </div>
              )}

              {method === 'qr' && (
                <div id="qrPanel" className="payment-detail">
                  <h3>Scan & pay (visual demo)</h3>
                  <div className="qr-demo" aria-label="Decorative QR placeholder, not scannable">
                    <div className="qr-corner top-left"></div>
                    <div className="qr-corner top-right"></div>
                    <div className="qr-corner bottom-left"></div>
                    <div className="qr-center">DEMO</div>
                  </div>
                  <p className="muted">This is a QR-style placeholder, not a real payment QR code.</p>
                  <div className="upi-copy">
                    <code id="demoUpi">demo@not-a-real-upi</code>
                    <button type="button" id="copyUpi" className="outline-btn" onClick={handleCopyUpi}>
                      Copy demo ID
                    </button>
                  </div>
                  {copyStatus && <p id="copyMessage" className="muted small" role="status">{copyStatus}</p>}
                </div>
              )}

              {method === 'card' && (
                <div id="cardPanel" className="payment-detail">
                  <h3>Debit / credit card</h3>
                  <p className="muted">For safety, this prototype does not ask for card numbers, expiry dates, or CVV. A real checkout would use a payment provider's secure card form.</p>
                  <div className="card-placeholder">💳 &nbsp; Secure card form available after gateway integration</div>
                </div>
              )}
            </section>
          </div>

          <aside className="checkout-panel order-summary">
            <h2>Donation summary</h2>
            <div className="summary-line">
              <span>Donation</span>
              <strong id="summaryAmount">{formatMoney(amount)}</strong>
            </div>
            <div className="summary-line">
              <span>Platform fee</span>
              <strong>₹0</strong>
            </div>
            <hr />
            <div className="summary-line summary-total">
              <span>Total</span>
              <strong id="summaryTotal">{formatMoney(amount)}</strong>
            </div>
            <p className="summary-method">
              Method: <strong id="summaryMethod">{getMethodLabel()}</strong>
            </p>
            <button type="submit" className="btn checkout-submit">
              Preview donation · <span id="buttonAmount">{formatMoney(amount)}</span>
            </button>
            <p className="muted small">🔒 Demo only. Clicking the button records a simulated pledge in your browser and Supabase database. No real money is transferred.</p>

            {/* Recent Live Community Pledges */}
            {recentPledges.length > 0 && (
              <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '14px', color: '#075985', marginBottom: '8px' }}>Recent Community Pledges</h3>
                {recentPledges.map((p, i) => (
                  <div key={p.id || i} style={{ fontSize: '12px', padding: '6px 0', borderBottom: '1px dashed #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{p.donor_name || p.name}</strong>
                      <span style={{ color: '#0369a1', fontWeight: 600 }}>₹{Number(p.amount).toLocaleString('en-IN')}</span>
                    </div>
                    <small style={{ color: '#64748b' }}>{p.payment_method || 'UPI'}</small>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </form>
      ) : (
        <section id="donationResult" className="result-panel" role="status">
          <div className="result-icon">✓</div>
          <h2>Demo pledge recorded!</h2>
          <p id="resultText">{submittedPledge}</p>
          <p>No payment was made. This is a simulated confirmation for your college project and saved into Supabase.</p>
          <button id="newDonation" className="outline-btn" type="button" onClick={handleReset}>
            Make another demo pledge
          </button>
        </section>
      )}
    </main>
  );
}

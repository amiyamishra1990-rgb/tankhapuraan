import React, { useState } from 'react';
import { validateEmail } from '../utils/taxCalculator';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://tankhapuraan-backend-432180395696.asia-south1.run.app';

const RECOMMENDATIONS = [
  { name: 'Naya Wage Code Jaanch', desc: 'Check if your salary structure meets the new 50% wage rule.', id: 'p3' },
  { name: 'Hike Mantra', desc: 'Prepping for appraisal? Know your real number before you ask.', id: 'p4' }
];

const Dashboard = ({ goHome, openProduct }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [orders, setOrders] = useState([]);

  const formatDate = (iso) => new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleLookup = async () => {
    if (!validateEmail(email)) { setError('Sahi email daalo'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/dashboard/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setOrders(data.orders || []);
      setSearched(true);
    } catch (err) {
      setError('Lookup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-view">
      <div className="product-view-inner">
        <div className="product-view-header">
          <p className="product-view-adhyaya">◆ My Reports ◆</p>
          <h2 className="product-view-title">Your Report History</h2>
          <p className="product-view-tagline">No password needed — enter the email you used.</p>
        </div>

        <div className="form-card">
          <div className="dashboard-lookup">
            <p className="dashboard-lookup-desc">We look up every report tied to your email — nothing to sign up for, nothing to remember.</p>
            <div className="dashboard-lookup-row">
              <input
                type="email"
                className={`form-input${error ? ' error' : ''}`}
                placeholder="your@email.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleLookup()}
              />
              <button className="btn-next" onClick={handleLookup} disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin" style={{marginRight:'6px'}}></i>Searching...</> : 'Find My Reports'}
              </button>
            </div>
            <span className="form-error">{error}</span>
          </div>

          {searched && (
            <div className="dashboard-orders">
              {orders.length === 0 ? (
                <div className="dashboard-empty">
                  <i className="fas fa-inbox" style={{fontSize:'1.6rem', color:'var(--border)', marginBottom:'10px', display:'block'}}></i>
                  No reports found for this email yet. If you just paid, give it a minute and try again.
                </div>
              ) : (
                orders.map((o, i) => (
                  <div key={i} className="dashboard-order-card">
                    <div className="dashboard-order-info">
                      <span className="dashboard-order-product">{o.product}</span>
                      <span className="dashboard-order-meta">{formatDate(o.date)} · Delivered to your email</span>
                    </div>
                    <span className={`product-status ${o.status === 'completed' ? 'status-live' : 'status-soon'}`}>
                      {o.status === 'completed' ? 'Delivered' : o.status === 'pending' ? 'Pending' : o.status}
                    </span>
                  </div>
                ))
              )}

              <div className="dashboard-recommend">
                <h3 className="form-section-title">◆ You Might Also Need</h3>
                <div className="products-grid" style={{gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                  {RECOMMENDATIONS.filter(r => !orders.some(o => o.productCode && o.productCode.startsWith(r.id))).map((r, i) => (
                    <div key={i} className="product-card live" onClick={() => openProduct(r.id)} style={{padding: '20px'}}>
                      <h3 className="product-name" style={{fontSize: '1.05rem'}}>{r.name}</h3>
                      <p className="product-tagline" style={{fontSize: '0.85rem', marginBottom: '8px'}}>{r.desc}</p>
                      <span className="product-price" style={{color: 'var(--green)', borderColor: 'var(--green)', fontWeight: 700}}>FREE</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="wizard-nav" style={{marginTop:'32px'}}>
            <button className="btn-prev" onClick={goHome}><i className="fas fa-arrow-left" style={{marginRight:'6px'}}></i> Wapas Home</button>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

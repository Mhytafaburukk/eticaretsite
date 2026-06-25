import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, addresses, logout, refreshAddresses } = useAuth();
  const [title, setTitle] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const userId = user.userId || user.id;

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const response = await fetch(`http://localhost:5147/api/Users/${userId}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, fullAddress })
      });
      
      if (!response.ok) throw new Error('Failed to add address');
      
      setTitle('');
      setFullAddress('');
      setMessage('Address added successfully!');
      refreshAddresses();
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await fetch(`http://localhost:5147/api/Users/addresses/${addressId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        refreshAddresses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container" style={{ display: 'flex', gap: '2rem', marginTop: '4rem', alignItems: 'flex-start' }}>
      {/* Profile Info */}
      <div className="glass-panel" style={{ padding: '2.5rem', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>My Profile</h2>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Name</p>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{user.name}</div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email</p>
          <div style={{ fontSize: '1.25rem' }}>{user.email}</div>
        </div>
      </div>

      {/* Addresses */}
      <div className="glass-panel" style={{ padding: '2.5rem', flex: 2 }}>
        <h2 style={{ margin: '0 0 2rem 0' }}>My Addresses</h2>
        
        {addresses.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>You don't have any addresses yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            {addresses.map(addr => (
              <div key={addr.id} style={{ padding: '1rem', border: '1px solid var(--card-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: 'var(--accent-color)' }}>{addr.title}</h4>
                  <button onClick={() => handleDeleteAddress(addr.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>&times;</button>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{addr.fullAddress}</p>
              </div>
            ))}
          </div>
        )}

        <h3 style={{ margin: '0 0 1rem 0' }}>Add New Address</h3>
        <form onSubmit={handleAddAddress}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Address Title (e.g. Home, Work)</label>
            <input 
              type="text"
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'white' }} 
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Address</label>
            <textarea 
              value={fullAddress} 
              onChange={e => setFullAddress(e.target.value)} 
              required
              rows="3"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'white', resize: 'vertical' }} 
            />
          </div>
          {message && <p style={{ color: message.includes('Error') ? '#ef4444' : '#4ade80', marginBottom: '1rem' }}>{message}</p>}
          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%' }}>
            {isSubmitting ? 'Adding...' : 'Add Address'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;

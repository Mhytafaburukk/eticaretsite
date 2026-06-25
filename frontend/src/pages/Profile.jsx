import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, updateAddress, logout } = useAuth();
  const [address, setAddress] = useState(user?.address || '');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const response = await fetch(`http://localhost:5147/api/Users/${user.id}/address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      
      if (!response.ok) throw new Error('Failed to update address');
      
      updateAddress(address);
      setMessage('Address updated successfully!');
    } catch (err) {
      setMessage('Error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '500px' }}>
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

        <form onSubmit={handleUpdateAddress}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Shipping Address</label>
            <textarea 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              rows="4"
              placeholder="Enter your full shipping address here..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.05)', color: 'white', resize: 'vertical' }} 
            />
          </div>
          {message && <p style={{ color: message.includes('Error') ? '#ef4444' : '#4ade80', marginBottom: '1rem' }}>{message}</p>}
          <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%' }}>
            {isSubmitting ? 'Updating...' : 'Update Address'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;

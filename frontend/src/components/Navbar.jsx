import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Navbar({ onOpenCart }) {
  const { totalItems } = useCart();
  const { user } = useAuth();

  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="navbar-brand text-gradient" style={{ textDecoration: 'none' }}>LuminaCommerce</Link>
      <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
        <li><Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Home</Link></li>
        
        {user ? (
          <>
            <li><Link to="/profile" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>My Profile</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none' }}>Login</Link></li>
            <li><Link to="/register" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>Register</Link></li>
          </>
        )}

        <li>
          <button onClick={onOpenCart} style={{ background: 'var(--accent-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Cart ({totalItems})
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;

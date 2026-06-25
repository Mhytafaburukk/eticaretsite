import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

function Cart({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);
    setError(null);

    const orderData = {
      totalAmount: totalAmount,
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price
      }))
    };

    try {
      const response = await fetch('http://localhost:5147/api/Orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px',
      background: 'var(--bg-color)', borderLeft: '1px solid var(--card-border)',
      boxShadow: '-8px 0 32px rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Your Cart</h2>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem' }}>
        {orderSuccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#4ade80' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎉 Order Successful!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Thank you for your purchase.</p>
            <button onClick={() => { setOrderSuccess(false); onClose(); }} className="btn-primary" style={{ marginTop: '2rem' }}>
              Continue Shopping
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>Your cart is empty.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
            {cartItems.map(item => (
              <div key={item.product.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.product.name}</h4>
                  <p style={{ color: 'var(--accent-color)', margin: '0.25rem 0 0 0' }}>${item.product.price.toFixed(2)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={() => updateQuantity(item.product.id, -1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product.id, 1)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                  <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>&times;</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!orderSuccess && cartItems.length > 0 && (
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--card-border)', background: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            <span>Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} disabled={isSubmitting} className="btn-primary" style={{ width: '100%' }}>
            {isSubmitting ? 'Processing...' : 'Complete Order'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;

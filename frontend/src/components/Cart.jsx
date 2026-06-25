import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Cart({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const { user, addresses } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Cart, 2: Checkout, 3: Success
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('Credit Card');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleProceedToCheckout = () => {
    if (!user) {
      onClose();
      navigate('/login');
      return;
    }
    setStep(2);
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      setError("Please select a shipping address.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const orderData = {
      totalAmount: totalAmount,
      userId: user.userId || user.id,
      shippingAddress: selectedAddress,
      paymentMethod: selectedPayment,
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

      setStep(3); // Success
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: '450px',
      background: 'var(--bg-color)', borderLeft: '1px solid var(--card-border)',
      boxShadow: '-8px 0 32px rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>
          {step === 1 ? 'Your Cart' : step === 2 ? 'Checkout' : 'Order Complete'}
        </h2>
        <button onClick={handleClose} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem' }}>
        {step === 3 ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: '#4ade80' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎉 Order Successful!</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Thank you for your purchase.</p>
            <button onClick={handleClose} className="btn-primary" style={{ marginTop: '2rem' }}>
              Continue Shopping
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>Your cart is empty.</p>
        ) : step === 1 ? (
          // Step 1: Cart Items
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
        ) : (
          // Step 2: Checkout (Address & Payment)
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Order Summary */}
            <div>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>Order Summary</h3>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '1rem' }}>
                {cartItems.map(item => (
                  <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>{item.quantity}x {item.product.name}</span>
                    <span style={{ color: 'var(--accent-color)' }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Selection */}
            <div>
              <h3 style={{ margin: '0 0 1rem 0' }}>1. Select Shipping Address</h3>
              {addresses.length === 0 ? (
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>You don't have any addresses saved.</p>
                  <button onClick={() => { onClose(); navigate('/profile'); }} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
                    Go to Profile to Add Address
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {addresses.map(addr => (
                    <label key={addr.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: `1px solid ${selectedAddress === addr.fullAddress ? 'var(--accent-color)' : 'var(--card-border)'}`, borderRadius: '8px', cursor: 'pointer', background: selectedAddress === addr.fullAddress ? 'rgba(99, 102, 241, 0.1)' : 'transparent' }}>
                      <input 
                        type="radio" 
                        name="address" 
                        value={addr.fullAddress}
                        checked={selectedAddress === addr.fullAddress}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        style={{ marginTop: '0.25rem' }}
                      />
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{addr.title}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{addr.fullAddress}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div>
              <h3 style={{ margin: '0 0 1rem 0' }}>2. Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Credit Card', 'Bank Transfer', 'Cash on Delivery'].map(method => (
                  <label key={method} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: `1px solid ${selectedPayment === method ? 'var(--accent-color)' : 'var(--card-border)'}`, borderRadius: '8px', cursor: 'pointer', background: selectedPayment === method ? 'rgba(99, 102, 241, 0.1)' : 'transparent' }}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value={method}
                      checked={selectedPayment === method}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && <div style={{ color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}
          </div>
        )}
      </div>

      {step !== 3 && cartItems.length > 0 && (
        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--card-border)', background: 'var(--card-bg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            <span>Total:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          
          {step === 1 ? (
            <button onClick={handleProceedToCheckout} className="btn-primary" style={{ width: '100%' }}>
              Proceed to Checkout
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid var(--card-border)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>
                Back
              </button>
              <button onClick={handleCheckout} disabled={isSubmitting || addresses.length === 0} className="btn-primary" style={{ flex: 2 }}>
                {isSubmitting ? 'Processing...' : 'Complete Order'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;

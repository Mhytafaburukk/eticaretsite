import React from 'react';
import { useCart } from '../context/CartContext';

function ProductCard({ product, delay }) {
  const { addToCart, getCartQuantity } = useCart();
  
  const cartQty = getCartQuantity(product.id);
  const remainingStock = product.unitsInStock - cartQty;

  return (
    <div className={`product-card glass-panel animate-fade-in delay-${delay}`}>
      <div className="product-image-container">
        <img src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <div className="product-category">{product.category?.name || 'Category'}</div>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-stock" style={{ color: remainingStock > 0 ? 'var(--text-secondary)' : '#ef4444', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>
          {remainingStock > 0 ? `Stok: ${remainingStock} adet` : 'Out of Stock'}
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button 
            onClick={() => addToCart(product)} 
            className="btn-primary"
            disabled={remainingStock <= 0}
            style={remainingStock <= 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            {remainingStock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

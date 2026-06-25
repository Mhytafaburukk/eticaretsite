import React from 'react';
import { useCart } from '../context/CartContext';

function ProductCard({ product, delay }) {
  const { addToCart } = useCart();

  return (
    <div className={`product-card glass-panel animate-fade-in delay-${delay}`}>
      <div className="product-image-container">
        <img src={product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <div className="product-category">{product.category?.name || 'Category'}</div>
        <h3 className="product-title">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button onClick={() => addToCart(product)} className="btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

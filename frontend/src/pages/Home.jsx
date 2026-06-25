import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5147/api/Products')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main className="container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem' }}>Discover Premium Products</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Elevate your lifestyle with our carefully curated collection of high-end items.
        </p>
      </div>

      {loading && <div className="spinner"></div>}
      
      {error && (
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
          <h2 style={{ color: '#ef4444' }}>Error Loading Products</h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} delay={((index % 4) + 1) * 100} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Home;

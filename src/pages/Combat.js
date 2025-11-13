import React, { useEffect, useState } from 'react';
import '../styles/Combat.css';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { toastError } from '../utils/toast';

const Combat = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        const filtered = (res.data || []).filter(p => p.category === 'Combat');
        setProducts(filtered);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        toastError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Breadcrumb title="Combat" />
      <div className="combat-page">
        <h1 className="combat-title">Combat Equipment</h1>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : products.length === 0 ? (
          <div className="no-products">No combat equipment available</div>
        ) : (
          <div className="products-grid">
            {products.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Combat;
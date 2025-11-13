import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Breadcrumb from '../components/Breadcrumb';
import ProductCard from '../components/ProductCard';
import '../styles/ShopAll.css';
import { toastSuccess, toastError } from '../utils/toast';

const SORT_OPTIONS = [
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'name_asc', label: 'Name: A → Z' },
  { value: 'name_desc', label: 'Name: Z → A' },
];

const ShopAll = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('price_asc');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    api.get('/products')
      .then((res) => {
        if (!mounted) return;
        setProducts(res.data || []);
      })
      .catch((err) => {
        console.error('Products load error', err);
        setError('Could not load products. Please try again later.');
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [products]);

  const sortedFiltered = useMemo(() => {
    const list = products.filter(p => categoryFilter === 'All' ? true : p.category === categoryFilter);
    switch (sort) {
      case 'price_asc':
        return list.slice().sort((a,b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      case 'price_desc':
        return list.slice().sort((a,b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      case 'name_asc':
        return list.slice().sort((a,b) => (a.name || '').localeCompare(b.name || ''));
      case 'name_desc':
        return list.slice().sort((a,b) => (b.name || '').localeCompare(a.name || ''));
      default:
        return list;
    }
  }, [products, sort, categoryFilter]);

  const addToCart = (product) => {
    try {
      const raw = localStorage.getItem('mg_cart');
      const cart = raw ? JSON.parse(raw) : [];
      const idx = cart.findIndex(c => c.id === (product._id || product.id));
      if (idx >= 0) {
        cart[idx].quantity = (cart[idx].quantity || 1) + 1;
      } else {
        cart.push({
          id: product._id || product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl || product.image || '',
          quantity: 1,
        });
      }
      localStorage.setItem('mg_cart', JSON.stringify(cart));
      toastSuccess('Added to cart');
    } catch (err) {
      console.error('Add to cart', err);
      toastError('Failed to add to cart');
    }
  };

  return (
    <>
      <Breadcrumb title="Shop" />

      <main className="shopall-page">
        <div className="shopall-header container">
          <h1 className="shopall-title">Shop All Products</h1>

          <div className="shop-controls">
            <div className="show-count">Show: <strong>{sortedFiltered.length}</strong></div>

            <div className="control-group">
              <select className="select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="control-group">
              <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-wrap">
            <div className="spinner" />
          </div>
        ) : error ? (
          <div className="error-wrap">{error}</div>
        ) : (
          <div className="products-grid container">
            {sortedFiltered.map(p => (
              <ProductCard key={p._id || p.id} product={p} onAdd={() => addToCart(p)} />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default ShopAll;
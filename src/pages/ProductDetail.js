import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import api from '../services/api';
import { toastSuccess, toastError } from '../utils/toast';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainIndex, setMainIndex] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.get('/products')
      .then(res => {
        if (!mounted) return;
        const found = (res.data || []).find(p => p._id === id || p.id === id);
        if (found) setProduct(found);
        else setProduct(null);
      })
      .catch(err => {
        console.error('Product fetch error', err);
        toastError('Failed to load product');
        setProduct(null);
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  if (loading) return (
    <>
      <Breadcrumb title="Product" />
      <div className="pd-loading"><div className="spinner" /></div>
    </>
  );

  if (!product) return (
    <>
      <Breadcrumb title="Product" />
      <div className="pd-error">Product not found.</div>
    </>
  );

  const images = (() => {
    if (Array.isArray(product.images) && product.images.length) return product.images;
    if (product.imageUrl) return [product.imageUrl];
    if (product.image) return [product.image];
    return [];
  })();

  const mainImage = images[mainIndex] || '';

  const changeQty = (delta) => {
    setQty(q => {
      const n = Math.max(1, q + delta);
      return n;
    });
  };

  const handleAddToCart = () => {
    try {
      const raw = localStorage.getItem('mg_cart');
      const cart = raw ? JSON.parse(raw) : [];
      const pid = product._id || product.id;
      const idx = cart.findIndex(c => c.id === pid);
      if (idx >= 0) {
        cart[idx].quantity = (cart[idx].quantity || 1) + qty;
      } else {
        cart.push({
          id: pid,
          name: product.name,
          price: product.price,
          image: images[0] || '',
          quantity: qty,
        });
      }
      localStorage.setItem('mg_cart', JSON.stringify(cart));
      toastSuccess('Added to cart');
    } catch (err) {
      console.error(err);
      toastError('Could not add to cart');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    history.push('/cart');
  };

  const inStock = Number(product.stock) > 0;

  return (
    <>
      <Breadcrumb title={product.name || 'Product'} />
      <main className="product-detail container">
        <div className="pd-grid">
          <aside className="pd-thumbs">
            {images.length ? images.map((src, i) => (
              <button
                key={i}
                className={`pd-thumb ${i === mainIndex ? 'active' : ''}`}
                onClick={() => setMainIndex(i)}
                aria-label={`View image ${i + 1}`}
                style={{ backgroundImage: `url(${src})` }}
              />
            )) : <div className="pd-thumb empty" />}
          </aside>

          <section className="pd-main">
            <div className="pd-image" style={{ backgroundImage: `url(${mainImage})` }} />
          </section>

          <aside className="pd-info">
            <h1 className="pd-title">{product.name}</h1>
            <div className="pd-underline" />
            <p className="pd-desc">{product.description}</p>

            <div className="pd-price">₦{product.price}</div>

            <div className="pd-meta">
              <span className={`stock-pill ${inStock ? 'in' : 'out'}`}>{inStock ? 'In stock' : 'Out of stock'}</span>
              <a className="pd-delivery" href="#delivery">DELIVERY IN 2 – 3 WORKING DAYS.</a>
            </div>

            <div className="pd-actions">
              <div className="qty">
                <button type="button" onClick={() => changeQty(-1)} aria-label="Decrease">−</button>
                <input type="text" value={qty} readOnly />
                <button type="button" onClick={() => changeQty(1)} aria-label="Increase">+</button>
              </div>

              <button className="btn-add" onClick={handleAddToCart} disabled={!inStock}>ADD TO CART</button>
              <button className="btn-buy" onClick={handleBuyNow} disabled={!inStock}>BUY NOW</button>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default ProductDetail;
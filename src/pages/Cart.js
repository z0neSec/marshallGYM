import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import '../styles/Cart.css';

function readCart() {
  try {
    const raw = localStorage.getItem('mg_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem('mg_cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));

  try {
    const count = (cart || []).reduce((s, i) => s + (Number(i.quantity) || 0), 0);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count } }));
  } catch (e) {
    // ignore
  }
}

const format = (n) => `₦${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const Cart = () => {
  const history = useHistory();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(readCart());
    const onStorage = () => setCart(readCart());
    window.addEventListener('storage', onStorage);
    window.addEventListener('cartUpdated', onStorage);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cartUpdated', onStorage);
    };
  }, []);

  const updateQty = (id, qty) => {
    const next = cart.map((c) => (c.id === id ? { ...c, quantity: Math.max(1, qty) } : c));
    setCart(next);
    writeCart(next);
  };

  const removeItem = (id) => {
    const next = cart.filter((c) => c.id !== id);
    setCart(next);
    writeCart(next);
  };

  const subtotal = cart.reduce((s, p) => s + (Number(p.price || 0) * Number(p.quantity || 0)), 0);
  const total = subtotal;

  const handleProceed = () => {
    history.push('/checkout');
  };

  if (!cart.length) {
    return (
      <>
        <Breadcrumb title="Cart" />
        <main className="cart-page container">
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <Link to="/shop-all" className="btn primary">Continue shopping</Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title="Shopping Cart" />
      <main className="cart-page container">
        <div className="cart-grid">
          <section className="cart-items">
            <div className="cart-header">
              <h2>Shopping Cart</h2>
            </div>

            <div className="cart-table">
              <div className="cart-row cart-row-head">
                <div className="col product-col">Product</div>
                <div className="col price-col">Price</div>
                <div className="col qty-col">Quantity</div>
                <div className="col subtotal-col subtotal-col-number">Subtotal</div>
              </div>

              {cart.map((item) => (
                <div className="cart-row" key={item.id}>
                  <div className="col product-col">
                    <button className="remove-btn" onClick={() => removeItem(item.id)} aria-label="Remove">✕</button>
                    <img src={item.image} alt={item.name} className="cart-thumb" />
                    <div className="product-meta">
                      <Link to={`/product/${item.id}`} className="product-name">{item.name}</Link>
                      <div className="product-stock">In Stock</div>
                    </div>
                  </div>

                  <div className="col price-col">{format(item.price)}</div>

                  <div className="col qty-col">
                    <div className="qty">
                      <button onClick={() => updateQty(item.id, Number(item.quantity || 1) - 1)}>-</button>
                      <input value={item.quantity} readOnly />
                      <button onClick={() => updateQty(item.id, Number(item.quantity || 1) + 1)}>+</button>
                    </div>
                  </div>

                  <div className="col subtotal-col subtotal-col-number">{format(Number(item.price || 0) * Number(item.quantity || 0))}</div>
                </div>
              ))}
            </div>
          </section>

          <aside className="cart-summary">
            <div className="summary-card">
              <h3>YOUR TOTAL</h3>
              <div className="summary-inner">
                <div className="summary-row">
                  <span className='summary-row-total'>Subtotal</span>
                  <span className="muted">{format(subtotal)}</span>
                </div>

                <div className="summary-row total-row">
                  <span className='summary-row-total'>Total</span>
                  <span className="total-amt">{format(total)}</span>
                </div>

                <button className="proceed-btn" onClick={handleProceed}>PROCEED TO CHECKOUT</button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default Cart;
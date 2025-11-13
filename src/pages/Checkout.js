import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import BankTransfer from '../components/BankTransfer';
import api from '../services/api';
import { toastSuccess, toastError } from '../utils/toast';
import '../styles/Checkout.css';
import { useHistory } from 'react-router-dom';

const Checkout = () => {
  const history = useHistory();
  const rawCart = typeof window !== 'undefined' ? localStorage.getItem('mg_cart') : null;
  const initialCart = rawCart ? JSON.parse(rawCart) : [];
  const [cart, setCart] = useState(initialCart);

  const subtotal = cart.reduce((s, i) => s + (Number(i.price || 0) * Number(i.quantity || 0)), 0);
  const total = subtotal;

  const [form, setForm] = useState({
    firstName: '', lastName: '', address: '', phone: '', email: '', notes: ''
  });
  const [order, setOrder] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const onUpdate = () => {
      const raw = localStorage.getItem('mg_cart');
      setCart(raw ? JSON.parse(raw) : []);
    };
    window.addEventListener('storage', onUpdate);
    window.addEventListener('cartUpdated', onUpdate);
    return () => {
      window.removeEventListener('storage', onUpdate);
      window.removeEventListener('cartUpdated', onUpdate);
    };
  }, []);

  const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleCreateOrder = async () => {
    if (!form.firstName || !form.lastName || !form.address || !form.phone || !form.email) {
      toastError('Please fill required billing details');
      return;
    }
    if (!cart.length) { toastError('Cart is empty'); return; }

    try {
      const payload = {
        customer: { ...form },
        items: cart.map(i => ({ productId: i.id, name: i.name, price: Number(i.price), quantity: Number(i.quantity) })),
        subtotal,
        total
      };
      const createRes = await api.post('/orders', payload);
      const newOrder = createRes.data;
      setOrder(newOrder);
      setShowPayment(true);
      toastSuccess('Order created... please proceed with bank transfer');
    } catch (err) {
      console.error('Order creation error', err);
      toastError(err.response?.data?.message || 'Could not create order');
    }
  };

  const handlePaymentSuccess = (paidOrder) => {
    localStorage.removeItem('mg_cart');
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: 0 } }));
    history.push(`/order?id=${paidOrder._id}`);
  };

  return (
    <>
      <Breadcrumb title="Checkout" />
      <main className="checkout-page container">
        <div className="checkout-grid">
          <section className="billing">
            <h2>Billing Details</h2>

            <div className="row two">
              <label>
                First name <span className="req">*</span>
                <input name="firstName" value={form.firstName} onChange={onChange} />
              </label>
              <label>
                Last name <span className="req">*</span>
                <input name="lastName" value={form.lastName} onChange={onChange} />
              </label>
            </div>

            <label>
              Address <span className="req">*</span>
              <input name="address" value={form.address} onChange={onChange} />
            </label>

            <label>
              Phone <span className="req">*</span>
              <input name="phone" value={form.phone} onChange={onChange} />
            </label>

            <label>
              Email address <span className="req">*</span>
              <input name="email" value={form.email} onChange={onChange} />
            </label>

            <label>
              Order notes (optional)
              <textarea name="notes" value={form.notes} onChange={onChange} placeholder="Notes about your order, e.g. special notes for delivery." rows={6} />
            </label>

            {showPayment ? (
              <>
                <BankTransfer orderId={order._id} onSuccess={handlePaymentSuccess} />
              </>
            ) : (
              <>
                <div className="payment-info">
                  <h3>PAYMENT METHOD</h3>
                  <div className="pay-desc">
                    Bank Transfer
                  </div>
                </div>

                <div className="place-order">
                  <button className="place-order-btn" onClick={handleCreateOrder}>
                    PROCEED TO BANK TRANSFER
                  </button>
                </div>
              </>
            )}
          </section>

          <aside className="order-review">
            <div className="review-card">
              <h3>REVIEW YOUR ORDER</h3>
              <div className="items">
                {cart.map(item => (
                  <div className="review-item" key={item.id}>
                    <img src={item.image} alt={item.name} />
                    <div className="meta">
                      <div className="name">{item.name}</div>
                      <div className="qty-price">
                        <div className="qty">- {item.quantity} +</div>
                        <div className="price">₦{item.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="review-summary">
                <div className="row subtotal">
                  <span>Subtotal</span>
                  <span>₦{subtotal}</span>
                </div>
                <div className="row total">
                  <span>Total</span>
                  <span>₦{total}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default Checkout;
import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import api from '../services/api';
import { toastSuccess, toastError } from '../utils/toast';
import '../styles/Checkout.css';
import { useHistory } from 'react-router-dom';

const REACT_PAYSTACK_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;

function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://js.paystack.co/v1/inline.js';
    s.onload = () => resolve(true);
    s.onerror = () => reject(new Error('Paystack script load failed'));
    document.body.appendChild(s);
  });
}

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
  const [loading, setLoading] = useState(false);

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

  const handlePay = async () => {
    if (!form.firstName || !form.lastName || !form.address || !form.phone || !form.email) {
      toastError('Please fill required billing details');
      return;
    }
    if (!cart.length) { toastError('Cart is empty'); return; }

    setLoading(true);
    try {
      // 1) create order on server (status: pending)
      const payload = {
        customer: { ...form },
        items: cart.map(i => ({ productId: i.id, name: i.name, price: Number(i.price), quantity: Number(i.quantity) })),
        subtotal,
        total
      };
      const createRes = await api.post('/orders', payload);
      const order = createRes.data;

      // 2) load paystack and initialize
      await loadPaystackScript();
      if (!window.PaystackPop) throw new Error('Paystack not available');

      const handler = window.PaystackPop.setup({
        key: REACT_PAYSTACK_KEY,
        email: form.email,
        amount: Math.round(total * 100), // Paystack expects amount in kobo (or cents)
        ref: `${order._id}-${Date.now()}`,
        // metadata can contain custom fields
        metadata: {
          custom_fields: [
            { display_name: "Order ID", variable_name: "order_id", value: order._id },
            { display_name: "Customer Phone", variable_name: "phone", value: form.phone }
          ]
        },

        // use a plain function here so Paystack accepts the callback
        callback: function(response) {
          // verify payment on the server
          api.post(`/orders/${order._id}/verify`, { reference: response.reference })
            .then((verifyRes) => {
              if (verifyRes.data && verifyRes.data.ok) {
                // success: clear cart, notify header, navigate / show success
                localStorage.removeItem('mg_cart');
                window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: 0 } }));
                toastSuccess('Payment successful — thank you!');
                history.push(`/order?id=${order._id}`);
              } else {
                toastError('Payment verification failed');
              }
            })
            .catch((e) => {
              console.error('verification error', e);
              toastError('Payment verification failed');
            });
        },

        onClose: function() {
          toastError('Payment window closed.');
        }
      });

      handler.openIframe();
    } catch (err) {
      console.error('Checkout error', err);
      toastError(err.response?.data?.message || err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
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

            <div className="payment-info">
              <h3>PAYMENT INFORMATION</h3>
              <div className="pay-desc">
                Paystack (Credit / Debit Card)
              </div>
            </div>

            <div className="place-order">
              <button className="place-order-btn" onClick={handlePay} disabled={loading}>
                {loading ? 'Processing…' : 'PLACE ORDER / PAY NOW'}
              </button>
            </div>
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
                        <div className="qty">{item.quantity}</div>
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
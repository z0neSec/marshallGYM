import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import Breadcrumb from '../components/Breadcrumb';
import '../styles/OrderComplete.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const OrderComplete = () => {
  const q = useQuery();
  const id = q.get('id');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    api.get(`/orders/${id}`).then(res => setOrder(res.data)).catch(() => setOrder(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (<><Breadcrumb title="Order" /><div className="container">Loading…</div></>);
  if (!order) return (<><Breadcrumb title="Order" /><div className="container">Order not found.</div></>);

  return (
    <>
      <Breadcrumb title="Order Complete" />
      <main className="order-complete container">
        <div className="oc-card">
          <h2>Thank you for shopping with Marshall Sport</h2>
          <p>Order ID: <strong>{order._id}</strong></p>
          <p>Total: <strong>₦{order.total}</strong></p>

          <h3>Items</h3>
          <ul className="oc-items">
            {order.items.map(i => (
              <li key={i.productId || i.name}>
                <span className="name">{i.name}</span>
                <span className="qty">×{i.quantity}</span>
              </li>
            ))}
          </ul>

          <h3>Shipping / billing</h3>
          <div className="oc-customer">
            <div>{order.customer.firstName} {order.customer.lastName}</div>
            <div>{order.customer.address}</div>
            <div>{order.customer.phone}</div>
            <div>{order.customer.email}</div>
          </div>

          <div className="oc-actions">
            <Link to="/shop-all" className="btn primary">Continue shopping</Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderComplete;
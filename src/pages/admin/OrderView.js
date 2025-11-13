import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Breadcrumb from '../../components/Breadcrumb';
import '../../styles/OrderView.css';

const OrderView = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(e => {
        console.error('Failed to fetch order:', e);
        setOrder(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (<div className="container">Loading…</div>);
  if (!order) return (<><Breadcrumb title="Order" parent="Admin" parentTo="/admin" /><div className="container">Order not found</div></>);
  
  const subtotal = order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  return (
    <>
      <Breadcrumb title={`Order ${order._id}`} parent="Orders" parentTo="/admin/orders" />
      <div className="order-view container">
        <div className="order-view-card">
          <h2>Order {order._id}</h2>
          
          <div className="order-header">
            <div className="order-header-item">
              <label>Total Amount</label>
              <div className="value">₦{order.total}</div>
            </div>
            <div className="order-header-item">
              <label>Status</label>
              <div className={`status ${order.status}`}>{order.status}</div>
            </div>
          </div>

          <div className="section">
            <h3>Customer Information</h3>
            <div className="customer-info">
              <div className="customer-info-item">
                <label>Name</label>
                <div className="info">{order.customer.firstName} {order.customer.lastName}</div>
              </div>
              <div className="customer-info-item">
                <label>Email</label>
                <div className="info">{order.customer.email}</div>
              </div>
              <div className="customer-info-item">
                <label>Phone</label>
                <div className="info">{order.customer.phone}</div>
              </div>
              <div className="customer-info-item">
                <label>Address</label>
                <div className="info">{order.customer.address}</div>
              </div>
              {order.customer.notes && (
                <div className="customer-info-item" style={{ gridColumn: '1 / -1' }}>
                  <label>Notes</label>
                  <div className="info">{order.customer.notes}</div>
                </div>
              )}
            </div>
          </div>

          <div className="section">
            <h3>Order Items</h3>
            <table className="order-items">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(i => (
                  <tr key={i.productId || i.name}>
                    <td>{i.name}</td>
                    <td>{i.quantity}</td>
                    <td>₦{i.price}</td>
                    <td>₦{(i.price * i.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <label>Subtotal</label>
              <div className="value">₦{subtotal.toFixed(2)}</div>
            </div>
            <div className="summary-row total">
              <label>Total</label>
              <div className="value">₦{order.total}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderView;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Breadcrumb from '../../components/Breadcrumb';
import '../../styles/AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/orders').then(res => {
      setOrders(res.data || []);
      setError(null);
    }).catch(err => {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
    }).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Breadcrumb title="Orders" parent="Admin" parentTo="/admin" />
      <div className="admin-orders container">
        <h2>Orders</h2>
        {loading ? <div>Loading…</div> : error ? <div className="error-msg">{error}</div> : (
          <table className="orders-table">
            <thead>
              <tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Total</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: '#999', padding: '16px' }}>No orders yet</td></tr>
              ) : orders.map(o => (
                <tr key={o._id}>
                  <td>{o._id}</td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td>{o.customer.firstName} {o.customer.lastName}<div className="muted">{o.customer.email}</div></td>
                  <td>₦{o.total}</td>
                  <td>{o.status}</td>
                  <td><Link to={`/admin/order/${o._id}`} className="admin-link">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminOrders;
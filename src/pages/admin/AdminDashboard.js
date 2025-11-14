import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/AdminDashboard.css';
import api from '../../services/api';
import { toastError } from '../../utils/toast';

const AdminDashboard = () => {
  const [summary, setSummary] = useState({ products: 0, stock: 0, orders: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders')
        ]);
        const products = prodRes.data || [];
        const orders = ordersRes.data || [];
        const totalStock = products.reduce((s, p) => s + (Number(p.stock) || 0), 0);
        setSummary({ products: products.length, stock: totalStock, orders: orders.length });
      } catch (err) {
        toastError('Could not load dashboard');
      }
    };
    load();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-title-row">
          <h1 className="admin-title">Admin Dashboard</h1>
          {/* Login/user icon (decorative) */}
          <a href="/admin/login" className="admin-login-icon" title="Admin login">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <circle cx="12" cy="8" r="3.2" stroke="#222" strokeWidth="1.2" />
              <path d="M4 20c0-3.2 2.8-5.8 6.2-5.8h3.6C17.2 14.2 20 16.8 20 20" stroke="#222" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="admin-cards">
          <div className="admin-card"><div className="card-number">{summary.products}</div><div className="card-label">Products</div></div>
          <div className="admin-card"><div className="card-number">{summary.stock}</div><div className="card-label">Total Stock</div></div>
          <div className="admin-card"><div className="card-number">{summary.orders}</div><div className="card-label">Orders</div></div>
        </div>

        <div className="admin-actions">
          <Link to="/admin/add" className="admin-btn">Add Product</Link>
          <Link to="/admin/products" className="admin-btn outline">View Products</Link>
          <Link to="/admin/orders" className="admin-btn">View Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
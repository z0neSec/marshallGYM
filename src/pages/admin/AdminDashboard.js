import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/AdminDashboard.css';
import api from '../../services/api';
import { toastError } from '../../utils/toast';

const AdminDashboard = () => {
  const [summary, setSummary] = useState({ products: 0, stock: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/products');
        const products = res.data || [];
        const totalStock = products.reduce((s, p) => s + (Number(p.stock) || 0), 0);
        setSummary({ products: products.length, stock: totalStock });
      } catch (err) {
        toastError('Could not load dashboard');
      }
    };
    load();
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="admin-cards">
          <div className="admin-card"><div className="card-number">{summary.products}</div><div className="card-label">Products</div></div>
          <div className="admin-card"><div className="card-number">{summary.stock}</div><div className="card-label">Total Stock</div></div>
          <div className="admin-card"><div className="card-number">—</div><div className="card-label">Orders</div></div>
        </div>

        <div className="admin-actions">
          <Link to="/admin/add" className="admin-btn">Add Product</Link>
          <Link to="/admin/products" className="admin-btn outline">View Products</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
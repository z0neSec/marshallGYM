import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import '../../styles/ProductList.css';
import api from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';

const ProductList = () => {
  const history = useHistory();
  const [products, setProducts] = useState([]);

  const fetch = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      toastError('Could not load products');
    }
  };

  useEffect(() => { fetch(); }, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toastSuccess('Deleted');
      fetch();
    } catch (err) {
      toastError('Delete failed');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="list-header">
          <h1 className="admin-title">Products</h1>
          <div className="nav-buttons">
            <Link to="/admin" className="admin-btn outline">Dashboard</Link>
            <Link to="/admin/orders" className="admin-btn outline">Orders</Link>
            <Link to="/admin/add" className="admin-btn">Add Product</Link>
          </div>
        </div>

        <div className="product-table-wrap">
          {products.length === 0 ? (
            <div className="empty">No products yet</div>
          ) : (
            <table className="product-table">
              <thead>
                <tr><th>Preview</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className={Number(p.stock) > 0 ? '' : 'out-of-stock-row'}>
                    <td className="td-preview"><img src={(p.images && p.images[0]) || p.imageUrl || p.image} alt={p.name} /></td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₦{p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button className="table-btn" onClick={() => history.push(`/admin/edit/${p._id}`)}>Edit</button>
                      <button className="table-btn danger" onClick={() => remove(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import { setAuthToken } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';
import '../../styles/AdminLogin.css';

const AdminLogin = () => {
  const history = useHistory();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toastError('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      const token = res.data.token;
      localStorage.setItem('admin_token', token);
      setAuthToken(token);
      toastSuccess('Logged in');
      history.push('/admin');
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Login failed';
      console.error('Login error:', err?.response || err);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container" style={{ maxWidth: 420 }}>
        <h1 className="admin-title">Admin Login</h1>
        <form className="product-form" onSubmit={onSubmit}>
          <label>Email<input name="email" value={form.email} onChange={onChange} type='text'/></label>
          <label>Password<input name="password" value={form.password} onChange={onChange} type="password" /></label>
          <div className="form-actions">
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import '../../styles/AddProduct.css';
import api, { setAuthToken } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';
import { getProducts, getProductById as localGet } from '../../utils/products'; // fallback local if needed

const initialState = { name: '', price: '', category: 'Cardio', description: '', stock: 0, image: '' };

const categories = ['Cardio', 'Strength', 'Free Weights', 'Functional', 'Combat'];

const AddProduct = () => {
    const history = useHistory();
    const { id } = useParams();
    const [form, setForm] = useState(initialState);
    const [uploading, setUploading] = useState(false);
    const token = localStorage.getItem('admin_token');

    useEffect(() => {
        if (token) setAuthToken(token);
        if (id) {
            api.get('/products').then(res => {
                const p = res.data.find(x => x._id === id || x.id === id);
                if (p) setForm({
                    name: p.name, price: p.price, category: p.category, description: p.description, stock: p.stock || 0, image: p.imageUrl || p.image || ''
                });
            }).catch(() => {
                const local = localGet(id);
                if (local) setForm({ name: local.name, price: local.price, category: local.category, description: local.description, stock: local.stock, image: local.image });
            });
        }
    }, [id, token]);

    const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

    const onFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setForm(s => ({ ...s, image: res.data.url }));
            toastSuccess('Image uploaded');
        } catch (err) {
            toastError('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.price || !form.category) {
            toastError('Please fill required fields');
            return;
        }
        try {
            if (id) {
                await api.put(`/products/${id}`, { name: form.name, price: Number(form.price), category: form.category, description: form.description, imageUrl: form.image, stock: Number(form.stock) });
                toastSuccess('Product updated');
            } else {
                await api.post('/products', { name: form.name, price: Number(form.price), category: form.category, description: form.description, imageUrl: form.image, stock: Number(form.stock) });
                toastSuccess('Product added');
            }
            history.push('/admin/products');
        } catch (err) {
            toastError(err.response?.data?.message || 'Save failed');
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-container">
                <h1 className="admin-title">{id ? 'Edit Product' : 'Add Product'}</h1>
                <form className="product-form" onSubmit={onSubmit}>
                    <label>Name<input name="name" value={form.name} onChange={onChange} type='text' /></label>
                    <label>Price<input name="price" type="number" step="0.01" value={form.price} onChange={onChange} /></label>
                    <label>Category
                        <select name="category" value={form.category} onChange={onChange}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </label>
                    <label>Stock<input name="stock" type="number" value={form.stock} onChange={onChange} /></label>
                    <label>Description<textarea name="description" rows="4" value={form.description} onChange={onChange} /></label>
                    <label className="image-field">
                        Image
                        <input type="file" accept="image/*" onChange={onFile} />
                        {uploading && <div>Uploading…</div>}
                        {form.image && <img src={form.image} alt="preview" className="image-preview" />}
                    </label>

                    <div className="form-actions">
                        <button type="button" className="btn secondary" onClick={() => history.push('/admin/products')}>Cancel</button>
                        <button type="submit" className="btn primary">{id ? 'Update Product' : 'Add Product'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
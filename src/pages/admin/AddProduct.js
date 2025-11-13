import React, { useState, useEffect } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import '../../styles/AddProduct.css';
import Breadcrumb from '../../components/Breadcrumb';
import api, { setAuthToken } from '../../services/api';
import { toastSuccess, toastError } from '../../utils/toast';
import { getProducts, getProductById as localGet } from '../../utils/products'; 

const initialState = { name: '', price: '', category: 'Cardio', description: '', stock: 0, image: '', images: [] };

const categories = ['Cardio', 'Strength', 'Free Weights', 'Functional', 'Combat', 'Others'];

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
                        name: p.name,
                        price: p.price,
                        category: p.category,
                        description: p.description,
                        stock: p.stock || 0,
                        image: p.imageUrl || (Array.isArray(p.images) && p.images[0]) || p.image || '',
                        images: Array.isArray(p.images) && p.images.length ? p.images : (p.imageUrl ? [p.imageUrl] : (p.image ? [p.image] : []))
                    });
                }).catch(() => {
                    const local = localGet(id);
                    if (local) setForm({ name: local.name, price: local.price, category: local.category, description: local.description, stock: local.stock, image: local.image });
                });
            }
    }, [id, token]);

    const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

    const onFile = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setUploading(true);
        try {
            const urls = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append('image', file);
                const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                if (res.data && res.data.url) urls.push(res.data.url);
            }
            setForm(s => ({ ...s, images: [...(s.images || []), ...urls], image: s.image || urls[0] || '' }));
            toastSuccess('Image(s) uploaded');
        } catch (err) {
            console.error('Upload error', err);
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
                await api.put(`/products/${id}`, { name: form.name, price: Number(form.price), category: form.category, description: form.description, imageUrl: form.image, images: form.images, stock: Number(form.stock) });
                toastSuccess('Product updated');
            } else {
                await api.post('/products', { name: form.name, price: Number(form.price), category: form.category, description: form.description, imageUrl: form.image, images: form.images, stock: Number(form.stock) });
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
                                {/* <Breadcrumb title={id ? 'Edit Product' : 'Add Product'} parent="Admin" parentTo="/admin" /> */}
                                <div className="add-product-header">
                    <h1 className="admin-title">{id ? 'Edit Product' : 'Add Product'}</h1>
                    <div className="nav-buttons">
                        <Link to="/admin" className="admin-btn outline">Dashboard</Link>
                        <Link to="/admin/products" className="admin-btn outline">Products</Link>
                    </div>
                </div>
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
                                                Images
                                                <input type="file" accept="image/*" onChange={onFile} multiple />
                                                {uploading && <div>Uploading…</div>}
                                                <div className="images-preview">
                                                    {(form.images || []).map((src, i) => (
                                                        <img key={i} src={src} alt={`preview-${i}`} className="image-preview" />
                                                    ))}
                                                </div>
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
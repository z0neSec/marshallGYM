import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';

const ProductCard = ({ product, onAdd }) => {
  const id = product._id || product.id;
  const price = product.price;
  const image = (product.images && product.images[0]) || product.imageUrl || product.image || '';
  const inStock = Number(product.stock) > 0;

  return (
    <div className={`product-card ${inStock ? '' : 'out-of-stock'}`}>
      <Link to={`/product/${id}`} className="card-image-link" aria-label={product.name}>
        <div className="card-image" style={{ backgroundImage: `url(${image})` }} />
      </Link>

      <div className="card-body">
        <Link to={`/product/${id}`} className="card-title">{product.name}</Link>

  <div className="card-stock">{inStock ? <span className="stock in">In stock</span> : <span className="stock out">Out of stock</span>}</div>

        <div className="card-price">₦{price}</div>

        <button className="add-cart-btn" onClick={onAdd} disabled={!inStock}>
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
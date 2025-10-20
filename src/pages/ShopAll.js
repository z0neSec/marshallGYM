import React from 'react';
import '../styles/ShopAll.css';
import Breadcrumb from '../components/Breadcrumb';

const ShopAll = () => (
    <>
      <Breadcrumb title="Shop" />

      <div className="shopall-page">
          <h1 className="shopall-title">Shop All Products</h1>
          {/* Add your all products here */}
      </div>
    </>
);

export default ShopAll;
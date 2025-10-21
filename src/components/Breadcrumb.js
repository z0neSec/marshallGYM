import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Breadcrumb.css';

const Breadcrumb = ({ title = 'Shop', parent = 'Home', parentTo = '/' }) => {
  return (
    <div className="page-breadcrumb" role="navigation" aria-label="breadcrumb">
      <div className="bc-container bc-inner">
        <Link to={parentTo} className="bc-link">{parent}</Link>
        <span className="bc-sep">/</span>
        <span className="bc-current">{title}</span>
      </div>
    </div>
  );
};

export default Breadcrumb;
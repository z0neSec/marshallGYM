import React from 'react';
import '../styles/Functional.css';
import Breadcrumb from '../components/Breadcrumb';

const Functional = () => (
    <>
        <Breadcrumb title="Functional" />

        <div className="functional-page">
            <h1 className="functional-title">Functional Equipment</h1>
            {/* Add your functional products here */}
        </div>
    </>
);

export default Functional;
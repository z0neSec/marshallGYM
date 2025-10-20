import React from 'react';
import '../styles/Cardio.css';
import Breadcrumb from '../components/Breadcrumb';

const Cardio = () => (
    <>
        <Breadcrumb title="Cardio" />

        <div className="cardio-page">
            <h1 className="cardio-title">Cardio Equipment</h1>
            {/* Add your cardio products here */}
        </div>
    </>
);

export default Cardio;
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import dumbbell_bg from '../images/dumbbell-hero-bg.png';
import strength_bg from '../images/strength-hero-bg.png';

const Home = () => {
    return (
        <main className="home-main">
            <div className="home-grid">
                <div className="home-hero">
                    <div className="home-hero-content">
                        <h1>
                            <span className="hero-title">GYM EQUIPMENT THAT PUSHES</span>
                            <span className="hero-title hero-title-green">YOU</span>
                        </h1>
                        <Link to="/shop-all" className="hero-btn">
                            SHOP NOW <span className="hero-btn-arrow">›</span>
                        </Link>
                    </div>
                </div>
                <div className="home-sale">
                    <div className="home-sale-content">
                        <h2>SHOP OUR OCTOBER SALE!</h2>
                        <Link to="/on-sale" className="sale-btn">
                            SHOP SALE
                        </Link>
                    </div>
                </div>
                <div className="home-dumbbells">
                    <div className="dumbbells-content">
                        <div className="dumbbells-title">DUMBBELLS</div>
                        <div className="dumbbells-sub">BEST PRICES IN SA</div>
                        <Link to="/free-weights" className="dumbbells-btn">
                            SHOP NOW
                        </Link>
                        <img src={dumbbell_bg} alt="Dumbbells" className="dumbbells-img" />
                    </div>
                </div>
                <div className="home-strength">
                    <div className="strength-content">
                        <div className="strength-title">STRENGTH EQUIPMENT</div>
                        <div className="strength-sub">BUILT FOR LEADING GYMS</div>
                        <Link to="/strength" className="strength-btn">
                            SHOP NOW
                        </Link>
                        <img src={strength_bg} alt="Strength Equipment" className="strength-img" />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;
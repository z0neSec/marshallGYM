import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

import logoImg from '../images/marshall_logo.png';
import phoneImg from '../images/contact-mail.png';
import truckImg from '../images/delivery-truck.png';
import searchImg from '../images/search-interface-symbol.png';
import cartImg from '../images/shopping-cart.png';
import heartImg from '../images/heart.png';

const navLinks = [
    { name: 'ON SALE', path: '/on-sale' },
    { name: 'CARDIO', path: '/cardio' },
    { name: 'STRENGTH', path: '/strength' },
    { name: 'FREE-WEIGHTS', path: '/free-weights' },
    { name: 'FUNCTIONAL', path: '/functional' },
    { name: 'COMBAT', path: '/combat' },
    { name: 'SHOP ALL', path: '/shop-all' },
    { name: 'CONTACT', path: '/contact' },
];

const Header = () => {

    return (
        <header className="header fixed-header">
            {/* Top Bar */}
            <div className="header-top">
                <div className="container header-top-container">
                    <div className="logo-area">
                        <Link to="/" className="logo-link">
                            <img src={logoImg} alt="Marshall Gym Logo" className="logo-img" />
                        </Link>
                        <div>
                            <span className="logo-gym">Marshall</span>
                            <div className="logo-sub">Sport Equipment Store</div>
                        </div>
                    </div>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search for products"
                            className="search-input"
                        />
                        <button className="search-btn">
                            <img src={searchImg} alt="Search" className="icon-img search-icon-img" />
                        </button>
                    </div>
                    <div className="header-contacts">
                        <div className="contact-item">
                            <img src={phoneImg} alt="Phone" className="contact-icon-img" />
                            <div>
                                <div className="contact-label">CONTACT US</div>
                                <div className="contact-value">0706-676-0538</div>
                            </div>
                        </div>
                        <div className="contact-item">
                            <img src={truckImg} alt="Truck" className="contact-icon-img" />
                            <div>
                                <div className="contact-label">NATIONWIDE</div>
                                <div className="contact-value">Speedy Delivery</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Navigation Bar */}
            <div className="header-nav">
                <div className="container header-nav-container">
                    <nav className="main-nav">
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="nav-link"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="header-icons">
                        <Link to="/wishlist" className="icon-btn">
                            <img src={heartImg} alt="Wishlist" className="icon-img" />
                            <span className="icon-badge">0</span>
                        </Link>
                        <Link to="/cart" className="icon-btn cart-btn">
                            <img src={cartImg} alt="Cart" className="icon-img" />
                            <span className="icon-badge cart-badge">0</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
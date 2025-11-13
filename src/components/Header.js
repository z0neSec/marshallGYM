import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

import logoImg from '../images/marshall_logo.png';
import searchImg from '../images/search-interface-symbol.png';
import cartImg from '../images/shopping-cart.png';
import heartImg from '../images/heart.png';
import phoneImg from '../images/contact-mail.png';
import truckImg from '../images/delivery-truck.png';

const navLinks = [
  { name: 'CARDIO', path: '/cardio' },
  { name: 'STRENGTH', path: '/strength' },
  { name: 'FREE-WEIGHTS', path: '/free-weights' },
  { name: 'FUNCTIONAL', path: '/functional' },
  { name: 'COMBAT', path: '/combat' },
  { name: 'SHOP ALL', path: '/shop-all' },
  { name: 'CONTACT', path: '/contact' },
];

function getCartCount() {
  try {
    const raw = localStorage.getItem('mg_cart');
    if (!raw) return 0;
    const cart = JSON.parse(raw);
    return cart.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
  } catch {
    return 0;
  }
}

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(getCartCount());

  useEffect(() => {
    const onUpdate = (ev) => {
      const detailCount = ev?.detail?.count;
      if (typeof detailCount === 'number') {
        setCartCount(detailCount);
        return;
      }
      setCartCount(getCartCount());
    };
    window.addEventListener('storage', onUpdate);
    window.addEventListener('cartUpdated', onUpdate);
    return () => {
      window.removeEventListener('storage', onUpdate);
      window.removeEventListener('cartUpdated', onUpdate);
    };
  }, []);

  return (
    <header className="header fixed-header">
      <div className="header-top">
        <div className="container header-top-container">
          <button
            className="menu-btn"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="0" width="24" height="2" rx="1" fill="#FFFFFF" />
              <rect y="8" width="24" height="2" rx="1" fill="#FFFFFF" />
              <rect y="16" width="24" height="2" rx="1" fill="#FFFFFF" />
            </svg>
          </button>

          <div className="logo-area">
            <Link to="/" className="logo-link" aria-label="Home">
              <img src={logoImg} alt="Marshall Gym Logo" className="logo-img" />
            </Link>
            <div className="logo-text">
              <span className="logo-gym">Marshall</span>
              <div className="logo-sub">Sport Equipment Store</div>
            </div>
          </div>

          <div className="header-icons-mobile">
            <Link to="/cart" className="icon-btn mobile-icon cart-btn" aria-label="Cart">
              <img src={cartImg} alt="Cart" className="icon-img" />
              <span className="icon-badge cart-badge">0</span>
            </Link>
          </div>

          <div className="header-top-desktop" aria-hidden="false">
            <div className="search-bar">
              <input type="text" placeholder="Search for products" className="search-input" />
              <button className="search-btn" aria-label="Search">
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
      </div>

      <div className="header-nav">
        <div className="container header-nav-container">
          <nav className="main-nav">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="nav-link">
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="header-icons">
            <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
              <img src={cartImg} alt="Cart" className="icon-img" />
              <span className="icon-badge cart-badge">{cartCount}</span>
            </Link>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true" onClick={() => setMobileOpen(false)}>
          <div className="mobile-nav-links" onClick={(e) => e.stopPropagation()}>
            <button className="mobile-close-btn" aria-label="Close menu" onClick={() => setMobileOpen(false)}>Close</button>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="mobile-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
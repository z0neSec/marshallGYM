import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import logoImg from '../images/marshall_logo.png';
import facebookIcon from '../images/facebook.png';
import instagramIcon from '../images/instagram.png';
import jijiIcon from '../images/Jiji.jpeg';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-main">
                <div className="footer-col footer-brand">
                    <div className="footer-logo-row">
                        <img src={logoImg} alt="Marshall Gym Logo" className="footer-logo-img" />
                        <div>
                            <span className="footer-logo-gym">Marshall</span>
                            <div className="footer-logo-sub">Sport Equipment Store</div>
                        </div>
                    </div>
                    <p className="footer-desc">
                        Trusted by fitness professionals &amp; fitness facilities across Africa for over 15 years, we are your reputable gym equipment supplier.
                    </p>
                    <div className="footer-social">
                        <div className="footer-social-title">Follow Us</div>
                        <div className="footer-social-icons">
                            <a href="https://www.facebook.com/share/19xaUXatmF/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                                <img src={facebookIcon} alt="Facebook" />
                            </a>
                            <a href="https://www.instagram.com/marshallsportequipment?igsh=MXVlMTFuc3gyc25xZw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
                                <img src={instagramIcon} alt="Instagram" />
                            </a>
                            <a href="https://jiji.ng/shop/marshallsport" target="_blank" rel="noopener noreferrer">
                                <img src={jijiIcon} alt="Jiji" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer-col">
                    <div className="footer-title">CATEGORIES</div>
                    <ul>
                        <li><Link to="/cardio">Cardio Equipment</Link></li>
                        <li><Link to="/combat">Combat Equipment</Link></li>
                        <li><Link to="/free-weights">Free-Weight Equipment</Link></li>
                        <li><Link to="/functional">Functional Equipment</Link></li>
                        <li><Link to="/strength">Strength Equipment</Link></li>
                        <li><Link to="/shop-all">Shop All</Link></li>
                    </ul>
                </div>
               
                <div className="footer-col">
                    <div className="footer-title">USEFUL LINKS</div>
                    <ul>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <span>
                    Made With Love, Sweat &amp; Happiness by <span className="footer-bottom-bold">z0ne</span> {new Date().getFullYear()}.
                </span>
            </div>
        </footer>
    );
};

export default Footer;
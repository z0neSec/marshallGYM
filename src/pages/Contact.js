import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import '../styles/Contact.css';

const Contact = () => {
    return (
        <>
            {/* <Breadcrumb title="Contact Us" /> */}

            <div className="contact-page">
                <div className="contact-banner" role="img" aria-label="Contact banner" />

                <div className="contact-container">
                    <h2 className="contact-heading">GET IN TOUCH</h2>

                    <div className="contact-columns">
                        <div className="contact-left">
                            <div className="contact-card">
                                <h3>WAREHOUSE</h3>
                                <p>
                                    2nd phase Akorede plaza block G19 <br /> along Oshodi Apapa Expressway Ijesha Bus Stop
                                </p>
                            </div>

                            <div className="contact-card">
                                <h3>SALES</h3>
                                <p>Email: <a href="mailto:muokaabuchi2020@gmail.com">muokaabuchi2020@gmail.com</a></p>
                                <p>Phone: <a href="tel:07066760538">0706 676 0538</a></p>
                            </div>
                        </div>

                        <div className="contact-right">

                            <div className="contact-card contact-reach">
                                <h3>REACH OUT</h3>
                                <p>
                                    Whether you have questions about our equipment, need assistance with your order,
                                    or want to share your experience with us, we’re here to help. Get in touch today!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-divider">
                        <span>WE ARE DEDICATED TO YOUR SUCCESS, WHETHER YOU'RE A GYM OWNER OR A FITNESS ENTHUSIAST.</span>
                    </div>

                    <section className="trading-times">
                        <h3>OUR TRADING TIMES</h3>

                        <div className="times-grid">
                            <div className="times-card">
                                <ul>
                                    <li><strong>MONDAY - THURSDAY:</strong> 8:30 - 16:00</li>
                                    <li><strong>FRIDAY:</strong> 8:30 - 15:00</li>
                                    <li><strong>SATURDAY:</strong> By appointment</li>
                                    <li><strong>SUNDAY:</strong> Closed</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Contact;
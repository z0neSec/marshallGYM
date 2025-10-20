import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CategoryCarousel.css';

import olympicImg from '../images/olympic-bars.jpeg';
import benchesImg from '../images/benches.jpeg';
import treadmillImg from '../images/treadmill.jpeg';
import ellipticalImg from '../images/elliptical.jpeg';
import bikeImg from '../images/exercise-bike.jpeg';
import dumbbellImg from '../images/dumbbells.jpeg';
import platesImg from '../images/weight-plates.jpeg';

const categories = [
  { title: 'OLYMPIC BARS', img: olympicImg, to: '/free-weights' },
  { title: 'BENCHES', img: benchesImg, to: '/strength' },
  { title: 'TREADMILLS', img: treadmillImg, to: '/cardio' },
  { title: 'ELLIPTICALS', img: ellipticalImg, to: '/cardio' },
  { title: 'EXERCISE BIKES', img: bikeImg, to: '/cardio' },
  { title: 'DUMBBELLS', img: dumbbellImg, to: '/free-weights' },
  { title: 'WEIGHT PLATES', img: platesImg, to: '/free-weights' },
];

const CategoryCarousel = () => {
  const containerRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);

  const items = [...categories, ...categories];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = null;
    const speed = 0.6; // px per frame (tweak for slower/faster)

    const step = () => {
      if (!paused) {
        const half = container.scrollWidth / 2;
        container.scrollLeft += speed;

        if (container.scrollLeft >= half) {
          container.scrollLeft -= half;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    container.scrollLeft = 0;
    rafId = requestAnimationFrame(step);

    // pause auto-scroll when user interacts via wheel/drag
    const onWheel = () => setPaused(true);
    const onPointerDown = () => setPaused(true);
    const onPointerUp = () => setPaused(false);

    container.addEventListener('wheel', onWheel, { passive: true });
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [paused]);

  const scrollBy = (amount) => {
    const container = containerRef.current;
    if (!container) return;
    // temporarily pause auto scroll so the user can control
    setPaused(true);
    container.scrollBy({ left: amount, behavior: 'smooth' });
    // resume after short delay
    setTimeout(() => setPaused(false), 800);
  };

  return (
    <section
      className="category-section"
      onMouseEnter={() => { setPaused(true); setHovering(true); }}
      onMouseLeave={() => { setPaused(false); setHovering(false); }}
    >
      <div className="category-header">
        <span className="header-line" aria-hidden="true" />
        <h2 className="header-title">GYM EQUIPMENT</h2>
        <span className="header-line" aria-hidden="true" />
      </div>

      <div className="category-sub">Popular Gym Equipment Categories</div>

      <div className="category-carousel">
        <div className="carousel-inner" ref={containerRef} aria-label="Popular categories">
          {items.map((c, idx) => (
            <Link
              key={`${c.title}-${idx}`}
              to={c.to}
              className="carousel-item"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="item-image" style={{ backgroundImage: `url(${c.img})` }} />
              <div className="item-overlay">
                <div className="item-title">{c.title}</div>
              </div>
            </Link>
          ))}
        </div>

        <button
          className={`carousel-arrow left ${hovering ? 'visible' : ''}`}
          aria-label="Scroll left"
          onClick={() => scrollBy(-320)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <button
          className={`carousel-arrow right ${hovering ? 'visible' : ''}`}
          aria-label="Scroll right"
          onClick={() => scrollBy(320)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="category-cta">
        <Link to="/shop-all" className="shop-all-btn">SHOP ALL <span className="cta-arrow">›</span></Link>
      </div>
    </section>
  );
};

export default CategoryCarousel;
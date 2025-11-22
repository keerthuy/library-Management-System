import React from "react";
import { Link } from "react-router-dom";


const Landing = () => {
  return (
    <div className="landing-container">
  
      <div className="landing-content">
        <header className="header">
          <div className="logo">
            <i className="fas fa-book-open"></i>
            <span>BookEra</span>
          </div>
          <div className="auth-buttons">
            <Link to="/login">
            <button className="btn btn-login">Login</button> </Link>
            <Link to="/register">
            <button className="btn btn-register">Register</button></Link>
          </div>
        </header>

        <section className="hero">
          <h1>Discover Your Next Favorite Book</h1>
          <p className="tagline">
            BookVerse is your trusted online bookstore. Explore thousands of
            titles across genres, get free shipping, and enjoy 24/7 support.
          </p>

          <div className="features">
            <div className="feature">
              <i className="fas fa-shipping-fast"></i>
              <span>Free Shipping</span>
            </div>
            <div className="feature">
              <i className="fas fa-book"></i>
              <span>100,000+ Titles</span>
            </div>
            <div className="feature">
              <i className="fas fa-headset"></i>
              <span>24/7 Support</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;

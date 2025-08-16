// src/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // CSS styles are now included directly in the component
  const styles = `
    .hero-section {
      background: linear-gradient(rgba(29, 53, 87, 0.7), rgba(29, 53, 87, 0.7)), url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop');
      background-size: cover;
      background-position: center;
      height: 70vh;
      min-height: 450px;
    }

    .hero-section h1 {
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    }

    .features-section {
      background-color: #f8f9fa;
    }

    .feature-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .card {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
      transform: translateY(-10px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.15);
    }
  `;

  return (
    <div className="homepage">
      <style>{styles}</style>
      {/* Hero Section */}
      <header className="hero-section text-white text-center d-flex flex-column justify-content-center align-items-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Empower Your Health Journey with AI</h1>
          <p className="lead my-3">
            Our advanced model analyzes key health factors to provide an estimated annual healthcare expenditure, helping you plan for the future with confidence.
          </p>
          <Link to="/predict" className="btn btn-primary btn-lg fw-bold px-4 py-2 mt-3">
            Predict My Costs Now <i className="fas fa-arrow-right ms-2"></i>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="feature-icon bg-primary text-white mb-3">
                    <i className="fas fa-brain fa-2x"></i>
                  </div>
                  <h3 className="h5 card-title fw-bold">AI-Powered Predictions</h3>
                  <p className="card-text text-muted">
                    Leverage a sophisticated machine learning model trained on thousands of real-world data points for a reliable cost estimate.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="feature-icon bg-success text-white mb-3">
                    <i className="fas fa-shield-alt fa-2x"></i>
                  </div>
                  <h3 className="h5 card-title fw-bold">Secure & Private</h3>
                  <p className="card-text text-muted">
                    Your privacy is our priority. All data is processed securely, and your personal information is never stored or shared.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="feature-icon bg-info text-white mb-3">
                    <i className="fas fa-tachometer-alt fa-2x"></i>
                  </div>
                  <h3 className="h5 card-title fw-bold">Instant Insights</h3>
                  <p className="card-text text-muted">
                    Receive your personalized healthcare cost prediction in seconds. No waiting, no complex forms, just straightforward results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>



        </section>      {/* Call to Action Section */}
    
    </div>
  );
};

export default HomePage;

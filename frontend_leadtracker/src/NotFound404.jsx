// src/pages/NotFound404.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound404 = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-5 p-4 text-center">
      <h1 className="display-1 text-danger mb-4">404 🚫</h1>
      <h2 className="h3 mb-2 text-muted">Page Not Found 😢</h2>
      <p className="mb-4 text-secondary">
        Oops! The page you're looking for doesn't exist or has been moved. 🔍📦
      </p>

      <Link
        to="/"
        className="btn btn-primary btn-lg px-5 py-3 shadow-lg position-relative overflow-hidden"
      >
        <span className="position-absolute top-0 start-0 w-100 h-100 bg-gradient opacity-10 blur-sm animate-pulse"></span>
        <span className="position-relative z-10 font-weight-bold">Go Home</span>
      </Link>
    </div>
  );
};

export default NotFound404;

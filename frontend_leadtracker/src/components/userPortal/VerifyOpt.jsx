import axios from 'axios';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const toast = useRef(null);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
     const opt = sessionStorage.getItem("opt");
      if (opt === otp) {
        navigate('/reset-password');
      } else {
        setError(res.data.message);
        toast.current.show({ severity: "warn", summary: res.data.message, detail: res.data.message, life: 3000 });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      toast.current.show({ severity: "warn", summary: err.response?.data?.message || 'Verification failed', detail: err.response?.data?.message || 'Verification failed', life: 3000 });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light px-3">
        <div className="card p-4 w-100" style={{ maxWidth: '400px' }}>
          <h2 className="text-center mb-4">Verify OTP</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleVerifyOtp}>
            <div className="mb-3">
              <label htmlFor="otp" className="form-label">OTP</label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="form-control"
                required
              />
              {error && <div className="invalid-feedback">{error}</div>}
            </div>

            <div className="mb-3">
              <button
                type="submit"
                className="btn w-100 mt-3 btn-primary"
              >
                Verify
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="mb-0">
              Didn't receive the OTP?{' '}
              <a href="/forgot-password" className="text-decoration-none">
                Resend OTP
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyOtp;

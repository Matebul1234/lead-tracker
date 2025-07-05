import axios from 'axios';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const toast = useRef(null);

  const handleSendOtp = async (e) => {
    debugger
  e.preventDefault();

  const cleanEmail = email.trim().toLowerCase();
  setEmail(cleanEmail);  // ✅ update local state first

  try {
    const res = await axios.post(`${API_URL}/api/user/forgot-password`, { email: cleanEmail });
    if (res.data.success) {
      console.log(res.data,"otttttt")
      localStorage.setItem("resetEmail", cleanEmail);
      sessionStorage.setItem("opt", res.data.otp);
      toast.current.show({ severity: "success", summary: "Success", detail: "OTP has been sent to your email", life: 3000 });
      navigate('/verify-otp');
    } else {
      setError(res.data.message);
      toast.current.show({ severity: "warn", summary: res.data.message, detail: res.data.message, life: 3000 });
    }
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong');
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: err.response?.data?.message || 'Something went wrong',
      life: 3000,
    });
  }
};
  return (
    <>
      <Toast ref={toast} />
      <div className="d-flex justify-content-center align-items-center min-vh-100  px-3">
        <div className="card p-4 w-100" style={{ maxWidth: '400px' }}>
          <h2 className="text-center mb-4">Forgot Password</h2>

          <form onSubmit={handleSendOtp}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Send OTP
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="mb-0">
              Remembered your password?{' '}
              <a href="/login" className="text-decoration-none">
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

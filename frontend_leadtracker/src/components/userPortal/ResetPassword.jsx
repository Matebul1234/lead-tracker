import axios from 'axios';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail');


  const toast = useRef(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      toast.current.show({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Passwords do not match',
        life: 3000,
      });
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      toast.current.show({
        severity: 'warn',
        summary: 'Weak Password',
        detail: 'Password must be at least 6 characters long',
        life: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/user/reset-password`, {
        email,
        newPassword,
      });

      if (res.data.success) {
        setSuccessMsg('Password reset successful! Redirecting to login...');
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Password reset successful! Redirecting to login...',
          life: 3000,
        });
        localStorage.removeItem('resetEmail'); // Clean up
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(res.data.message);
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: res.data.message,
          life: 3000,
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Reset failed';
      setError(message);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <Toast ref={toast} />
      <div className="d-flex justify-content-center align-items-center min-vh-100 px-3">
        <div className="card p-4 w-100" style={{ maxWidth: '400px' }}>
          <h2 className="text-center mb-4">Reset Password</h2>

          <form onSubmit={handleResetPassword}>

            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className={`form-control ${error && !newPassword ? 'is-invalid' : ''}`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {error && !newPassword && (
                <div className="invalid-feedback">Please enter a new password</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`form-control ${error && !confirmPassword ? 'is-invalid' : ''}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {error && !confirmPassword && (
                <div className="invalid-feedback">Please confirm your password</div>
              )}
            </div>

            <div className="mb-3">
              <button
                type="submit"
                className={`btn w-100 ${isSubmitting ? 'btn-secondary' : 'btn-primary'}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;

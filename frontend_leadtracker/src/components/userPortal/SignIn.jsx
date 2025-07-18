import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import { Toast } from 'primereact/toast';
import { Eye, EyeOff } from 'lucide-react';

const SignIn = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.current?.show({ severity: 'warn', summary: 'Validation', detail: 'Please fix form errors' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/api/user/login`, formData, { withCredentials: true });

      console.log(response.data, "this data after login");
      if (response.data.success) {
        localStorage.setItem('accessToken', response.data.accesstoken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('username', response.data.userdata.name); //  response.data.userdata)
        localStorage.setItem('useremail', response.data.userdata.email);
        localStorage.setItem('userrole', response.data.userdata.role);
        toast.current?.show({ severity: 'success', summary: 'Login Successful', detail: response.data.message || 'Logged in' });

        navigate('/dashboard');
        // Or redirect based on role
      } else {
        toast.current?.show({ severity: 'error', summary: 'Login Failed', detail: response.data.message || 'Something went wrong' });
      }

    } catch (error) {
      console.error('Login error:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.response?.data?.message || error.message || 'Login failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toast ref={toast} />

      <div className="d-flex justify-content-center align-items-center min-vh-100 px-3">
        <div className="card p-4 w-100" style={{ maxWidth: '450px' }}>
          <h2 className="text-center mb-4">Login to your account</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3 position-relative">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"

                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-outline-secondary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
            </div>


            <div className="d-flex justify-content-end mb-3">
              <Link to="/forgot-password" className="text-decoration-none">Forgot your password?</Link>
            </div>

            <div className="mb-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn w-100 ${isSubmitting ? 'btn-secondary' : 'btn-primary'}`}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="mb-0">
              Don't have an account?{' '}
              <Link to="/signup" className="text-decoration-none">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;

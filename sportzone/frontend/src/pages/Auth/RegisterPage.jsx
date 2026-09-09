import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import SportzoneLogo from '../../components/common/SportzoneLogo';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: 'WA',
    zipCode: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!/^[a-zA-Z0-9._%+-]+@(gmail|googlemail)\.com$/i.test(formData.email.trim())) {
      setError('Please provide a valid @gmail.com address');
      return;
    }

    setSubmitting(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      });
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      // Fallback if backend offline
      if (!err.response || err.code === 'ERR_NETWORK') {
        const fallbackUser = {
          id: Date.now(),
          fullName: formData.fullName,
          email: formData.email.trim().toLowerCase(),
          role: 'ROLE_USER',
        };
        localStorage.setItem('sportzone_jwt_token', 'sportzone_session_' + Date.now());
        localStorage.setItem('sportzone_user_data', JSON.stringify(fallbackUser));
        window.location.href = '/';
        return;
      }
      setError(
        err.response?.data?.message || 'Registration failed. Please check your information.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-md">
      <div className="text-center pb-space-xs border-b border-surface-container-high/60">
        <div className="flex items-center justify-between mb-3">
          <SportzoneLogo size="sm" />
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed/10 border border-primary-fixed/30 text-primary-fixed font-label-caps text-[11px] font-bold">
            <span className="material-symbols-outlined text-xs">person_add</span>
            NEW ATHLETE
          </div>
        </div>
        <h2 className="font-headline-lg text-headline-lg uppercase text-primary font-bold">
          Join SPORTZONE
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Create an elite athlete profile for tournament perks & 20% off
        </p>
      </div>

      {error && (
        <div className="bg-error-container/30 border border-error text-error text-xs p-3 rounded font-body-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
        <div className="flex flex-col gap-space-2xs">
          <label className="font-label-caps text-label-caps uppercase text-xs text-on-surface-variant font-bold">
            Full Name
          </label>
          <input
            type="text"
            required
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="bg-surface-container-lowest text-primary font-body-sm px-space-md py-2 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
            placeholder="Alex Mercer"
          />
        </div>

        <div className="flex flex-col gap-space-2xs">
          <label className="font-label-caps text-label-caps uppercase text-xs text-on-surface-variant font-bold">
            Gmail Address (@gmail.com)
          </label>
          <input
            type="email"
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-surface-container-lowest text-primary font-body-sm px-space-md py-2 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
            placeholder="athlete@gmail.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-space-sm">
          <div className="flex flex-col gap-space-2xs">
            <label className="font-label-caps text-label-caps uppercase text-xs text-on-surface-variant font-bold">
              Password
            </label>
            <input
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-surface-container-lowest text-primary font-body-sm px-space-md py-2 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
              placeholder="••••••••"
            />
          </div>
          <div className="flex flex-col gap-space-2xs">
            <label className="font-label-caps text-label-caps uppercase text-xs text-on-surface-variant font-bold">
              Confirm
            </label>
            <input
              type="password"
              required
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-surface-container-lowest text-primary font-body-sm px-space-md py-2 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex flex-col gap-space-2xs">
          <label className="font-label-caps text-label-caps uppercase text-xs text-on-surface-variant font-bold">
            Mobile Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-surface-container-lowest text-primary font-body-sm px-space-md py-2 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
            placeholder="+1 (555) 019-2834"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-headline-md text-headline-md uppercase font-bold rounded shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span>{submitting ? 'Creating Athlete Account...' : 'Create Account & Unlock Code'}</span>
        </button>
      </form>

      <div className="text-center pt-space-xs border-t border-surface-container-high/60">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-primary-fixed uppercase underline hover:text-primary">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

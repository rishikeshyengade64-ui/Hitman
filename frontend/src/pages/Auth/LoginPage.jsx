import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import SportzoneLogo from '../../components/common/SportzoneLogo';

export const LoginPage = () => {
  const [username, setUsername] = useState('Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@gmail.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);

  // Gmail Verification States
  const [isGmailVerified, setIsGmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [activeCodeBanner, setActiveCodeBanner] = useState(null);

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

  // If already authenticated, redirect to store
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  // Timer countdown for resending code
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const isGmailAddress = (val) => {
    return /^[a-zA-Z0-9._%+-]+@(gmail|googlemail)\.com$/i.test(val.trim());
  };

  const handleSendVerificationCode = () => {
    setError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setError('Please enter your Gmail address first');
      return;
    }

    if (!isGmailAddress(email)) {
      setError('Please enter a valid Gmail address (e.g. name@gmail.com)');
      return;
    }

    // Generate random 6-digit verification code
    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    setVerificationCode(generatedCode);
    setIsCodeSent(true);
    setCountdown(60);
    setActiveCodeBanner(generatedCode);
  };

  const handleVerifyCode = () => {
    setError('');
    if (!enteredCode.trim()) {
      setError('Please enter the 6-digit verification code');
      return;
    }

    if (enteredCode.trim() === verificationCode) {
      setIsGmailVerified(true);
      setIsCodeSent(false);
      setActiveCodeBanner(null);
      setSuccessMessage(`Gmail (${email}) verified successfully!`);
    } else {
      setError('Invalid verification code. Please check the code and try again.');
    }
  };

  const handleAutoFillCode = () => {
    if (activeCodeBanner) {
      setEnteredCode(activeCodeBanner);
    }
  };

  const handleUseDemo = () => {
    setUsername('Alex Mercer');
    setEmail('alex.mercer@gmail.com');
    setPassword('Password123!');
    setIsGmailVerified(true);
    setIsCodeSent(false);
    setActiveCodeBanner(null);
    setSuccessMessage('Demo credentials pre-loaded and Gmail verified!');
    setError('');
  };

  const handleGoogleQuickSignIn = async () => {
    setError('');
    setSubmitting(true);
    try {
      const googleUser = {
        username: username.trim() || 'Alex Mercer',
        email: email.trim().toLowerCase().endsWith('@gmail.com') ? email.trim() : 'alex.mercer@gmail.com',
      };
      await loginWithGoogle(googleUser);
      navigate(redirectUrl);
    } catch (err) {
      console.error('Google Sign In error:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!username.trim()) {
      setError('Please provide your Username / Athlete Name');
      return;
    }

    if (!isGmailAddress(email)) {
      setError('A valid @gmail.com address is required');
      return;
    }

    if (!isGmailVerified) {
      setError('Please complete Gmail verification before signing in');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setSubmitting(true);

    try {
      await login({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      navigate(redirectUrl);
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
          'Unable to sign in. Please verify your credentials or use the demo login.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-md">
      {/* Header */}
      <div className="text-center pb-space-xs border-b border-surface-container-high/60">
        <div className="flex items-center justify-between mb-3">
          <SportzoneLogo size="sm" />
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed/10 border border-primary-fixed/30 text-primary-fixed font-label-caps text-[11px] font-bold">
            <span className="material-symbols-outlined text-xs">verified_user</span>
            VERIFIED ACCESS
          </div>
        </div>
        <h2 className="font-headline-lg text-headline-lg uppercase text-primary font-bold">
          Athlete Sign In
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Enter your Username, verify your Gmail & enter password to access SportZone
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-error-container/30 border border-error text-error text-xs p-3 rounded font-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-950/40 border border-green-500/60 text-green-400 text-xs p-3 rounded font-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base shrink-0">check_circle</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Simulated Gmail Verification Alert Banner */}
      {activeCodeBanner && (
        <div className="p-3 bg-primary-fixed/15 border border-primary-fixed rounded-lg text-primary animate-fadeIn flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed">mark_email_read</span>
              <span className="font-label-caps uppercase text-xs font-bold text-primary-fixed">
                Gmail Verification Code
              </span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant">Expires in 10m</span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Security code sent to <span className="font-bold text-primary">{email}</span>:
          </p>
          <div className="flex items-center justify-between bg-surface-container-lowest px-3 py-2 rounded border border-surface-container-high">
            <span className="font-mono text-lg tracking-widest font-black text-primary-fixed">
              {activeCodeBanner}
            </span>
            <button
              type="button"
              onClick={handleAutoFillCode}
              className="text-xs font-bold text-primary hover:text-primary-fixed underline flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">content_paste</span>
              Auto-Fill Code
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
        {/* 1. Username Field */}
        <div className="flex flex-col gap-space-2xs">
          <label className="font-label-caps text-label-caps uppercase text-xs text-on-surface-variant font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary-fixed">person</span>
            Username / Athlete Name
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-surface-container-lowest text-primary font-body-sm px-space-md py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed transition-colors"
            placeholder="e.g. Alex Mercer"
          />
        </div>

        {/* 2. Gmail Field + Verification */}
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center justify-between">
            <label className="font-label-caps text-label-caps uppercase text-xs text-on-surface-variant font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary-fixed">mail</span>
              Gmail Address
            </label>
            {isGmailVerified ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-400 bg-green-950/50 px-2 py-0.5 rounded border border-green-500/40">
                <span className="material-symbols-outlined text-xs">verified</span>
                Verified
              </span>
            ) : (
              <span className="text-[11px] text-amber-400/90 font-medium">
                *Verification Required
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="email"
              required
              disabled={isGmailVerified}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsGmailVerified(false);
                setIsCodeSent(false);
                setActiveCodeBanner(null);
              }}
              className={`flex-1 bg-surface-container-lowest text-primary font-body-sm px-space-md py-2.5 rounded border focus:outline-none transition-colors ${
                isGmailVerified
                  ? 'border-green-500/60 bg-surface-container-low opacity-90'
                  : 'border-surface-container-high focus:border-primary-fixed'
              }`}
              placeholder="athlete@gmail.com"
            />
            {isGmailVerified ? (
              <button
                type="button"
                onClick={() => setIsGmailVerified(false)}
                className="px-3 py-2 text-xs font-bold rounded bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors shrink-0 cursor-pointer"
              >
                Change
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendVerificationCode}
                disabled={countdown > 0 || !email.trim()}
                className="px-3 py-2 text-xs font-bold uppercase rounded bg-primary-fixed/20 text-primary-fixed border border-primary-fixed/40 hover:bg-primary-fixed hover:text-on-primary transition-all shrink-0 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>{countdown > 0 ? `${countdown}s` : 'Send Code'}</span>
              </button>
            )}
          </div>
          <span className="text-[11px] text-on-surface-variant/70">
            Must be an active @gmail.com address.
          </span>
        </div>

        {/* 3. OTP Code Verification Input Box (Shows when code is sent) */}
        {isCodeSent && !isGmailVerified && (
          <div className="p-3 bg-surface-container rounded-lg border border-surface-container-high flex flex-col gap-2 animate-fadeIn">
            <label className="font-label-caps uppercase text-xs text-primary-fixed font-bold flex items-center justify-between">
              <span>Enter 6-Digit Verification Code</span>
              <button
                type="button"
                onClick={handleSendVerificationCode}
                disabled={countdown > 0}
                className="text-[11px] text-on-surface-variant hover:underline disabled:opacity-50 cursor-pointer"
              >
                Resend {countdown > 0 && `(${countdown}s)`}
              </button>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value.replace(/\D/g, ''))}
                placeholder="6-digit code"
                className="flex-1 bg-surface-container-lowest text-primary font-mono text-center tracking-widest text-base px-3 py-2 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
              />
              <button
                type="button"
                onClick={handleVerifyCode}
                className="px-4 py-2 bg-primary-fixed text-on-primary font-bold text-xs uppercase rounded hover:bg-primary-fixed-dim transition-colors cursor-pointer"
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {/* 4. Password Field */}
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-center justify-between">
            <label className="font-label-caps text-label-caps uppercase text-xs text-on-surface-variant font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary-fixed">lock</span>
              Gmail / Account Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-on-surface-variant hover:text-primary flex items-center gap-1 font-body-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-surface-container-lowest text-primary font-body-sm px-space-md py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed transition-colors"
            placeholder="••••••••"
          />
        </div>

        {/* Quick Demo Pre-fill helper */}
        <div className="flex items-center justify-between p-2.5 bg-surface-container/60 rounded border border-surface-container-high text-[11px] text-on-surface-variant">
          <div>
            <span className="font-bold text-primary">Preloaded Athlete:</span>{' '}
            <span className="font-mono">alex.mercer@gmail.com</span>
          </div>
          <button
            type="button"
            onClick={handleUseDemo}
            className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary-fixed hover:text-on-primary font-bold text-primary-fixed transition-colors cursor-pointer"
          >
            Auto-Fill
          </button>
        </div>

        {/* 5. Submit Sign In Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-headline-md text-headline-md uppercase font-bold rounded shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-50 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">login</span>
          <span>{submitting ? 'Authenticating Athlete...' : 'Sign In & Enter Store'}</span>
        </button>

        {/* Alternative: Instant Sign In with Google */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-surface-container-high"></div>
          <span className="flex-shrink mx-3 text-xs uppercase font-label-caps text-on-surface-variant">
            Or Quick Connect
          </span>
          <div className="flex-grow border-t border-surface-container-high"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleQuickSignIn}
          disabled={submitting}
          className="w-full py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-body-sm text-sm rounded border border-surface-container-high transition-colors flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="font-semibold">Instant Sign In with Google</span>
        </button>
      </form>

      {/* Footer link */}
      <div className="text-center pt-space-xs border-t border-surface-container-high/60">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          New athlete to SportZone?{' '}
          <Link to="/register" className="font-bold text-primary-fixed uppercase underline hover:text-primary">
            Create Profile
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import SportzoneLogo from '../common/SportzoneLogo';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-space-md py-space-xl relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-fixed/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary-container/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Top Side Corner SportZone Logo */}
      <div className="absolute top-5 left-5 sm:top-7 sm:left-7 z-30">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 group bg-surface-container/70 hover:bg-surface-container-high/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-surface-container-high hover:border-primary-fixed/50 transition-all shadow-lg"
        >
          <SportzoneLogo size="sm" />
          <span className="hidden sm:inline-block font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed/80 font-bold border-l border-surface-container-high pl-2">
            PORTAL
          </span>
        </Link>
      </div>

      {/* Brand Header */}
      <div className="mb-space-lg text-center z-10">
        <Link to="/" className="inline-flex items-center justify-center group focus:outline-none">
          <SportzoneLogo size="lg" />
        </Link>
        <p className="font-label-caps text-label-caps uppercase tracking-widest text-primary-fixed text-xs mt-2">
          High-Velocity Athletic Portal
        </p>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md bg-surface-container-low rounded-xl p-space-xl border border-surface-container-high/60 shadow-2xl z-10">
        <Outlet />
      </div>

      {/* Footer copyright */}
      <div className="mt-space-lg text-center text-xs text-on-surface-variant z-10 font-body-sm">
        © 2025 SPORTZONE Global Inc. All rights reserved.
      </div>
    </div>
  );
};

export default AuthLayout;

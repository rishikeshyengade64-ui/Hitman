import React, { useState, useRef, useEffect } from 'react';

export const CartItemImage = ({ src, alt, className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(false);

    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoading(false);
    }
  }, [src]);

  return (
    <div className={`relative w-full h-full bg-surface-container-lowest overflow-hidden flex items-center justify-center select-none ${className}`}>
      {/* Animated Loading Telemetry - displayed when picture is loading / not yet loaded */}
      {loading && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-surface-container-high/80 backdrop-blur-xs">
          {/* Animated Diagonal Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-fixed/15 to-transparent -translate-x-full animate-shimmer pointer-events-none"></div>

          {/* Athletic Spinner Telemetry */}
          <div className="relative flex items-center justify-center mb-1">
            <span
              className="material-symbols-outlined text-2xl text-primary-fixed animate-spin"
              style={{ animationDuration: '1s' }}
            >
              progress_activity
            </span>
          </div>

          <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed/90 font-bold animate-pulse">
            LOADING IMAGE
          </span>
        </div>
      )}

      {/* Fallback Display if image fails to load or no src provided */}
      {error || !src ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-surface-container-lowest text-center border border-surface-container-high/60">
          <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary-fixed mb-1 shadow-inner">
            <span className="material-symbols-outlined text-lg">sports_score</span>
          </div>
          <span className="text-[10px] font-label-caps uppercase text-primary font-bold line-clamp-1">
            {alt || 'SPORTZONE PRO'}
          </span>
          <span className="text-[8px] font-mono text-outline-variant uppercase">
            GEAR SPEC
          </span>
        </div>
      ) : (
        /* Actual Image with smooth fade-in */
        <img
          ref={imgRef}
          src={src}
          alt={alt || 'SportZone product'}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        />
      )}
    </div>
  );
};

export default CartItemImage;

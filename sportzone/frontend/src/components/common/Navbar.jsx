import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import SportzoneLogo from './SportzoneLogo';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems, subtotal } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isNavActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 shadow-[0_1px_8px_rgba(0,0,0,0.4)]">
      {/* Top Flash Sale Announcement Banner */}
      <div className="w-full bg-secondary-container text-on-secondary-container px-space-md py-space-2xs text-center flex items-center justify-center gap-space-xs">
        <span className="material-symbols-outlined text-sm text-primary-fixed">bolt</span>
        <span className="font-label-caps text-label-caps uppercase tracking-wider text-xs sm:text-sm font-bold">
          FLASH SALE: Extra 20% OFF on all Pro Gear with code <span className="underline">SPORT20</span> | Free Express Shipping over ₹999
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-20 bg-surface/95 backdrop-blur-xl border-b border-surface-container-high/60">
        <div className="max-w-[1440px] mx-auto h-full px-space-md lg:px-space-xl flex items-center justify-between gap-space-lg">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center shrink-0 group focus:outline-none">
            <SportzoneLogo size="md" />
          </Link>

          {/* Nav Categories */}
          <nav className="hidden xl:flex items-center gap-space-lg h-full">
            <Link
              to="/"
              className={`font-label-caps text-label-caps uppercase py-space-sm transition-colors ${
                isNavActive('/') ? 'text-primary-fixed border-b-2 border-primary-fixed font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`font-label-caps text-label-caps uppercase py-space-sm transition-colors ${
                isNavActive('/shop') ? 'text-primary-fixed border-b-2 border-primary-fixed font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Shop
            </Link>
            <Link
              to="/shop?category=running"
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors py-space-sm uppercase"
            >
              Men
            </Link>
            <Link
              to="/shop?category=gym-fitness"
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors py-space-sm uppercase"
            >
              Women
            </Link>
            <Link
              to="/shop?category=football"
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors py-space-sm uppercase"
            >
              Kids
            </Link>

            {/* Sports Mega Dropdown */}
            <div className="relative group h-full flex items-center">
              <button
                type="button"
                className="font-label-caps text-label-caps text-on-surface-variant group-hover:text-primary-fixed transition-colors py-space-sm uppercase flex items-center gap-1"
              >
                Sports
                <span className="material-symbols-outlined text-xs">expand_more</span>
              </button>
              <div className="absolute top-[72px] left-0 hidden group-hover:flex flex-col w-56 bg-surface-container-high/95 backdrop-blur-xl rounded-lg p-space-sm shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-surface-variant z-50 animate-fadeIn">
                <Link to="/shop?category=badminton" className="px-space-sm py-space-xs rounded font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed hover:bg-surface-container-highest transition-colors flex items-center justify-between">
                  Badminton
                  <span className="text-[10px] text-primary-fixed uppercase tracking-wider font-mono font-bold">New</span>
                </Link>
                <Link to="/shop?category=cricket" className="px-space-sm py-space-xs rounded font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed hover:bg-surface-container-highest transition-colors">
                  Cricket
                </Link>
                <Link to="/shop?category=football" className="px-space-sm py-space-xs rounded font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed hover:bg-surface-container-highest transition-colors">
                  Football
                </Link>
                <Link to="/shop?category=basketball" className="px-space-sm py-space-xs rounded font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed hover:bg-surface-container-highest transition-colors">
                  Basketball
                </Link>
                <Link to="/shop?category=tennis" className="px-space-sm py-space-xs rounded font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed hover:bg-surface-container-highest transition-colors">
                  Tennis
                </Link>
                <Link to="/shop?category=running" className="px-space-sm py-space-xs rounded font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed hover:bg-surface-container-highest transition-colors">
                  Running
                </Link>
                <Link to="/shop?category=gym-fitness" className="px-space-sm py-space-xs rounded font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed hover:bg-surface-container-highest transition-colors">
                  Gym & Fitness
                </Link>
                <Link to="/shop?category=cycling" className="px-space-sm py-space-xs rounded font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed hover:bg-surface-container-highest transition-colors">
                  Cycling
                </Link>
              </div>
            </div>

            <Link
              to="/shop?sort=newest"
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface transition-colors py-space-sm uppercase"
            >
              New Arrivals
            </Link>
            <Link
              to="/shop?sort=discount"
              className="font-label-caps text-label-caps text-secondary hover:text-on-secondary-container transition-colors py-space-sm uppercase flex items-center gap-1 font-bold"
            >
              Offers
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
            </Link>
          </nav>

          {/* Search Input with ⌘K */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-space-md flex-1 max-w-xs xl:max-w-sm ml-auto mr-space-md">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-lg pointer-events-none">
                search
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gear, shoes, apparel..."
                className="w-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm pl-9 pr-12 py-2 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed transition-colors placeholder:text-on-surface-variant/60"
              />
              <span className="absolute right-space-xs top-1/2 -translate-y-1/2 bg-surface-container-high px-1.5 py-0.5 rounded text-[10px] font-mono text-on-surface-variant">
                ⌘K
              </span>
            </div>
          </form>

          {/* Actions & Utilities: Wishlist, Cart, User Profile */}
          <div className="flex items-center gap-space-sm shrink-0">
            {/* Wishlist button */}
            <button
              aria-label="Wishlist"
              className="relative p-space-xs text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => navigate('/shop')}
            >
              <span className="material-symbols-outlined text-xl">favorite</span>
              <span className="absolute top-1 right-1 bg-secondary-container text-on-secondary-container font-label-sm text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Cart Button */}
            <Link
              to="/checkout"
              aria-label="Cart"
              className="relative flex items-center gap-space-xs px-space-sm py-1.5 bg-surface-container hover:bg-surface-container-high rounded transition-colors text-on-surface shadow-sm"
            >
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-xl text-primary-fixed">shopping_bag</span>
                <span className="absolute -top-1.5 -right-2 bg-primary-fixed text-on-primary font-label-sm text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              </div>
              <span className="font-label-caps text-label-caps font-bold text-primary ml-1 hidden sm:inline">
                {formatCurrency(subtotal)}
              </span>
            </Link>

            {/* Auth Profile / Login */}
            <div className="relative pl-space-xs">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-space-xs focus:outline-none hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {(user?.fullName || user?.username || 'A')[0]}
                    </div>
                    <div className="hidden lg:flex flex-col text-left">
                      <span className="font-body-sm text-body-sm font-bold text-primary leading-tight truncate max-w-[120px]">
                        {user?.fullName || user?.username || 'Athlete'}
                      </span>
                      <span className="text-[10px] font-mono text-green-400 leading-tight flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> Verified
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-xs text-on-surface-variant ml-1">expand_more</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-surface-container-high rounded-lg shadow-xl border border-surface-variant py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-surface-variant">
                        <p className="text-[10px] text-on-surface-variant font-label-caps uppercase">Athlete Profile</p>
                        <p className="text-sm font-bold text-primary truncate">{user?.fullName || 'Athlete'}</p>
                        <p className="text-xs text-on-surface-variant font-mono truncate mt-0.5">{user?.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-highest hover:text-primary-fixed transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">receipt_long</span>
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:bg-surface-container-highest transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-space-xs">
                  <Link
                    to="/login"
                    className="font-label-caps text-label-caps uppercase text-xs px-3 py-1.5 rounded bg-surface-container-high text-primary hover:text-primary-fixed transition-colors font-bold"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="font-label-caps text-label-caps uppercase text-xs px-3 py-1.5 rounded bg-primary-fixed text-on-primary font-bold hover:bg-primary-fixed-dim transition-colors hidden sm:inline"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

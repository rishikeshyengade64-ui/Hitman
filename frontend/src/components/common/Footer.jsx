import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SportzoneLogo from './SportzoneLogo';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-surface-container-high/60">
      <div className="max-w-[1440px] mx-auto px-space-md lg:px-space-xl py-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl mb-space-2xl">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 flex flex-col gap-space-md pr-space-lg">
            <div className="flex items-center gap-space-sm">
              <SportzoneLogo size="lg" />
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Engineered for peak performance, extreme velocity, and athletic mastery. Providing world-class pro gear and footwear to champions worldwide.
            </p>

            <div className="flex flex-col gap-space-xs mt-space-xs">
              <span className="font-label-caps text-label-caps uppercase text-primary-fixed font-bold text-xs">
                Get 15% Off Your First Order
              </span>
              {subscribed ? (
                <div className="bg-primary-fixed/10 border border-primary-fixed text-primary-fixed px-3 py-2 rounded text-sm font-semibold">
                  ✓ Welcome to the team! Check your inbox for your 15% discount.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-space-xs max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your athletic email"
                    className="bg-surface-container text-on-surface font-body-sm text-body-sm px-space-md py-2.5 rounded border border-surface-container-high flex-1 focus:outline-none focus:border-primary-fixed transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-label-caps text-label-caps uppercase font-bold px-space-md py-2.5 rounded transition-all"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Explore Sports */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-headline-md text-headline-md tracking-wider uppercase text-on-surface font-semibold">
              Explore Sports
            </span>
            <div className="flex flex-col gap-space-2xs">
              <Link to="/shop?category=cricket" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Cricket
              </Link>
              <Link to="/shop?category=football" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Football
              </Link>
              <Link to="/shop?category=basketball" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Basketball
              </Link>
              <Link to="/shop?category=tennis" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Tennis
              </Link>
              <Link to="/shop?category=running" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Running
              </Link>
              <Link to="/shop?category=gym-fitness" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Gym & Fitness
              </Link>
              <Link to="/shop?category=cycling" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Cycling
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-headline-md text-headline-md tracking-wider uppercase text-on-surface font-semibold">
              Categories
            </span>
            <div className="flex flex-col gap-space-2xs">
              <Link to="/shop" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Footwear
              </Link>
              <Link to="/shop" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Apparel
              </Link>
              <Link to="/shop" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Equipment & Bats
              </Link>
              <Link to="/shop" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Accessories
              </Link>
              <Link to="/shop" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Sports Nutrition
              </Link>
              <Link to="/shop" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Wearables & Tech
              </Link>
            </div>
          </div>

          {/* Customer Care */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-headline-md text-headline-md tracking-wider uppercase text-on-surface font-semibold">
              Customer Care
            </span>
            <div className="flex flex-col gap-space-2xs">
              <Link to="/orders" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Order Tracking
              </Link>
              <a href="#shipping" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Shipping & Delivery
              </a>
              <a href="#returns" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Returns & Refunds
              </a>
              <a href="#stores" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Store Locator
              </a>
              <a href="#warranty" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Warranty & Repairs
              </a>
              <a href="#contact" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-space-lg border-t border-surface-container-high/60 flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="font-body-sm text-body-sm text-on-surface-variant">
            © 2025 SPORTZONE Global Inc. All rights reserved. Built for champions.
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="font-label-caps text-label-caps text-on-surface-variant text-xs uppercase">
              Certified Secure Checkout:
            </span>
            <div className="flex items-center gap-space-xs font-mono text-xs font-bold text-on-surface-variant bg-surface-container px-2 py-1 rounded">
              <span className="material-symbols-outlined text-sm text-primary-fixed">lock</span>
              <span>VISA</span>
              <span className="text-surface-variant">•</span>
              <span>MASTERCARD</span>
              <span className="text-surface-variant">•</span>
              <span>AMEX</span>
              <span className="text-surface-variant">•</span>
              <span>APPLE PAY</span>
              <span className="text-surface-variant">•</span>
              <span>PAYPAL</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

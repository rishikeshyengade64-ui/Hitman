import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { ALL_CATEGORIES, ALL_PRODUCTS } from '../../data/catalog';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [cats, products] = await Promise.allSettled([
          categoryService.getAllCategories(),
          productService.getFeaturedProducts(),
        ]);

        if (cats.status === 'fulfilled' && cats.value?.length > 0) {
          setCategories(cats.value);
        } else {
          setCategories(ALL_CATEGORIES);
        }

        if (products.status === 'fulfilled' && products.value?.length > 0) {
          setFeaturedProducts(products.value);
        } else {
          // Curate top showcase items from catalog (Badminton, Cricket Bat, Football, Tennis, Running, Basketball)
          setFeaturedProducts(ALL_PRODUCTS.slice(0, 8));
        }
      } catch (err) {
        console.error('Error loading home data:', err);
        setCategories(ALL_CATEGORIES);
        setFeaturedProducts(ALL_PRODUCTS.slice(0, 8));
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleQuickAdd = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id, null, 1, product);
  };

  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION: High-Voltage Athletic Theatre (Dark Kinetic Obsidian) */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface via-surface-container-lowest to-surface border-b border-surface-container-high/60 py-space-3xl">
        {/* Dynamic Atmospheric Glows */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#ccff00]/15 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-secondary-container/20 rounded-full blur-[160px] pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto px-space-md lg:px-space-xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Text & Action Column */}
            <div className="lg:col-span-7 flex flex-col items-start gap-space-lg">
              <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface-container-high/80 border border-outline-variant/60 text-on-surface shadow-sm">
                <span className="material-symbols-outlined text-sm text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-xs font-bold text-primary-fixed">
                  OFFICIAL TOURNAMENT SPEC 2025
                </span>
              </div>

              <div className="flex flex-col">
                <h1 className="font-display-hero text-headline-xl sm:text-display-hero text-primary tracking-tight uppercase leading-none font-black">
                  GEAR UP.
                </h1>
                <h1 className="font-display-hero text-headline-xl sm:text-display-hero text-primary-fixed tracking-tight uppercase leading-none font-black">
                  PLAY HARD.
                </h1>
              </div>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Engineered with high-velocity 3K carbon plates and AeroFoam+ damping telemetry. Step onto the court, track, or pitch with elite professional footwear and gear.
              </p>

              <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
                <Link
                  to="/shop"
                  className="px-space-xl py-3.5 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-headline-md text-headline-md uppercase font-bold rounded shadow-[0_0_24px_rgba(204,255,0,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-space-xs"
                >
                  <span>Explore Catalog</span>
                  <span className="material-symbols-outlined font-bold text-lg">arrow_forward</span>
                </Link>
                <Link
                  to="/products/1"
                  className="px-space-xl py-3.5 bg-surface-container hover:bg-surface-container-high text-primary font-headline-md text-headline-md uppercase font-bold rounded border border-surface-variant transition-all flex items-center gap-space-xs"
                >
                  <span>CarbonVolt Strider</span>
                  <span className="material-symbols-outlined text-lg text-secondary">bolt</span>
                </Link>
              </div>

              {/* Telemetry Snapshot Tickers */}
              <div className="grid grid-cols-3 gap-space-md pt-space-md border-t border-surface-container-high/60 w-full max-w-lg mt-space-sm">
                <div>
                  <span className="font-display-hero text-2xl sm:text-3xl text-primary font-bold">215g</span>
                  <span className="block font-label-caps text-label-caps text-xs text-on-surface-variant uppercase">Race Weight</span>
                </div>
                <div>
                  <span className="font-display-hero text-2xl sm:text-3xl text-primary-fixed font-bold">88.4%</span>
                  <span className="block font-label-caps text-label-caps text-xs text-on-surface-variant uppercase">Energy Return</span>
                </div>
                <div>
                  <span className="font-display-hero text-2xl sm:text-3xl text-secondary font-bold">3K</span>
                  <span className="block font-label-caps text-label-caps text-xs text-on-surface-variant uppercase">Carbon Fiber</span>
                </div>
              </div>
            </div>

            {/* Visual Hero Showcase Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full aspect-[4/3] rounded-2xl bg-surface-container-low border border-surface-container-high p-space-md shadow-2xl overflow-hidden group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKmDVOu-fCXOb_FraoY84dlcYkkrDTbQZobWus_qgHS8e7_2XyC-6TmpSuUvF3xB5pm2lhwQiZ5HI4pM0IhV5iK_mw9m3Y8ixoAz2P_bsJ8Yh9MHAesN-blLKIK0_SD7wSrG0Q5Dv1S7VPxFY95pEXRFmp-OrI_fBc-g5istAzBGByBdjl7b4-mdaJPooYLqQIMNWsF8_OAeE0Qjl1KltPQw-234DqQ6vfy1raW6vD-M0wi0e5E72L"
                  alt="CarbonVolt Strider Road Racing Shoes"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-space-lg left-space-lg">
                  <span className="bg-secondary-container text-on-secondary-container font-label-caps text-xs uppercase px-2.5 py-1 rounded font-bold tracking-wider shadow-md">
                    2025 FLAGSHIP DROP
                  </span>
                </div>
                <div className="absolute bottom-space-lg left-space-lg right-space-lg bg-surface-container-highest/90 backdrop-blur-md p-space-md rounded-xl border border-surface-variant flex items-center justify-between">
                  <div>
                    <h3 className="font-title-base text-title-base text-primary uppercase font-bold truncate">
                      CarbonVolt Strider
                    </h3>
                    <span className="text-primary-fixed font-headline-md font-bold text-lg">
                      {formatCurrency(199.99)}
                    </span>
                  </div>
                  <Link
                    to="/products/1"
                    className="px-space-md py-2 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-label-caps text-xs uppercase font-bold rounded transition-colors"
                  >
                    View PDP
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="max-w-[1440px] mx-auto w-full px-space-md lg:px-space-xl py-space-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-xl">
          <div>
            <div className="flex items-center gap-space-xs text-primary-fixed font-label-caps text-label-caps uppercase mb-1">
              <span className="material-symbols-outlined text-sm">category</span>
              <span>Sports Disciplines</span>
            </div>
            <h2 className="font-headline-xl text-headline-xl uppercase text-primary font-bold">
              Shop By Sport
            </h2>
          </div>
          <Link
            to="/shop"
            className="font-label-caps text-label-caps text-primary-fixed uppercase hover:underline flex items-center gap-1 font-bold text-xs"
          >
            <span>All Categories</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-space-md">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="bg-surface-container hover:bg-surface-container-high rounded-xl p-space-md flex flex-col items-center text-center gap-space-sm transition-all border border-surface-variant/40 hover:border-primary-fixed/50 hover:scale-[1.03] group shadow-sm"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary-fixed group-hover:bg-primary-fixed group-hover:text-on-primary transition-colors shadow-inner">
                <span className="material-symbols-outlined text-2xl">{cat.icon || 'sports'}</span>
              </div>
              <div>
                <span className="font-headline-md text-headline-md uppercase text-primary block font-bold text-sm">
                  {cat.name}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {cat.itemCount || 100}+ items
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRO PRODUCTS GRID */}
      <section className="w-full bg-surface-container-low py-space-2xl border-t border-b border-surface-container-high/60">
        <div className="max-w-[1440px] mx-auto px-space-md lg:px-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-xl">
            <div>
              <div className="flex items-center gap-space-xs text-primary-fixed font-label-caps text-label-caps uppercase mb-1">
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span>Pro Athlete Certified</span>
              </div>
              <h2 className="font-headline-xl text-headline-xl uppercase text-primary font-bold">
                Featured Performance Gear
              </h2>
            </div>
            <Link
              to="/shop"
              className="font-label-caps text-label-caps text-primary-fixed uppercase hover:underline flex items-center gap-1 font-bold text-xs"
            >
              <span>View Full Catalog</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="group relative bg-surface-container rounded-xl overflow-hidden border border-surface-container-high/60 hover:border-primary-fixed/60 transition-all flex flex-col justify-between shadow-md cursor-pointer"
              >
                {/* Product Image & Badges */}
                <div className="relative w-full aspect-[4/3] bg-surface-container-lowest overflow-hidden">
                  <img
                    src={product.primaryImageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.discountPercentage > 0 && (
                    <span className="absolute top-2 left-2 bg-secondary-container text-on-secondary-container font-label-caps text-[10px] uppercase px-2 py-0.5 rounded font-bold shadow">
                      -{product.discountPercentage}% OFF
                    </span>
                  )}
                  <span className="absolute top-2 right-2 bg-surface-container-lowest/80 text-primary-fixed font-label-caps text-[10px] uppercase px-2 py-0.5 rounded backdrop-blur-md">
                    {product.brand}
                  </span>
                </div>

                {/* Info Container */}
                <div className="p-space-md flex flex-col flex-1 justify-between gap-space-xs">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant text-[11px] tracking-wider block">
                      {product.categoryName || 'PRO SPORT'}
                    </span>
                    <h3 className="font-title-base text-title-base text-primary uppercase font-bold truncate group-hover:text-primary-fixed transition-colors">
                      {product.title}
                    </h3>
                  </div>

                  {/* Rating & Review */}
                  <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span className="font-bold text-on-surface">{product.rating}</span>
                    <span>({product.reviewCount || 42})</span>
                  </div>

                  {/* Price & Quick Add */}
                  <div className="flex items-center justify-between pt-space-xs border-t border-surface-container-high/60 mt-space-xs">
                    <div>
                      <span className="font-headline-md text-headline-md text-primary font-bold">
                        {formatCurrency(product.price)}
                      </span>
                      {product.msrp && (
                        <span className="block text-[11px] text-on-surface-variant line-through">
                          {formatCurrency(product.msrp)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="p-2 bg-surface-container-high hover:bg-primary-fixed text-primary hover:text-on-primary rounded-lg transition-colors shadow-sm"
                      title="Quick Add to Cart"
                    >
                      <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATHLETE TRUST & PROMISE BANNER */}
      <section className="max-w-[1440px] mx-auto w-full px-space-md lg:px-space-xl py-space-2xl">
        <div className="bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-high rounded-2xl p-space-xl border border-surface-variant flex flex-col lg:flex-row items-center justify-between gap-space-xl relative overflow-hidden shadow-xl">
          <div className="flex flex-col gap-space-xs max-w-xl z-10">
            <span className="font-label-caps text-label-caps uppercase text-primary-fixed tracking-widest text-xs font-bold">
              Guaranteed Performance Standards
            </span>
            <h2 className="font-headline-xl text-headline-xl uppercase text-primary font-black leading-tight">
              30-DAY ON-TRACK WEAR TEST
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Take any pro gear for a real spin. If you don't break your personal record, return it within 30 days for a 100% full refund. No questions asked.
            </p>
          </div>
          <Link
            to="/shop"
            className="px-space-xl py-3.5 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-headline-md text-headline-md uppercase font-bold rounded shadow-[0_0_24px_rgba(204,255,0,0.3)] shrink-0 transition-all"
          >
            Start Your Test
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

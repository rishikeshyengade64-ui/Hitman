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
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('badminton');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const activeCategory =
    categories.find((c) => c.slug === selectedCategorySlug) ||
    ALL_CATEGORIES.find((c) => c.slug === selectedCategorySlug) ||
    categories[0] ||
    ALL_CATEGORIES[0];

  const categoryProducts =
    selectedCategorySlug === 'all'
      ? ALL_PRODUCTS
      : ALL_PRODUCTS.filter((p) => p.categorySlug === selectedCategorySlug);

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
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary-fixed/5 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-secondary-container/5 rounded-full blur-[140px] pointer-events-none"></div>

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
                <div className="absolute bottom-space-lg left-space-lg right-space-lg bg-surface-container-low/95 backdrop-blur-md p-space-md rounded-xl border border-surface-container-high shadow-lg flex items-center justify-between">
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

      {/* CATEGORIES SECTION WITH ACCURATE ITEMS */}
      <section className="max-w-[1440px] mx-auto w-full px-space-md lg:px-space-xl py-space-2xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-lg">
          <div>
            <div className="flex items-center gap-space-xs text-primary-fixed font-label-caps text-label-caps uppercase mb-1">
              <span className="material-symbols-outlined text-sm">category</span>
              <span>Sports Disciplines & Accurate Gear</span>
            </div>
            <h2 className="font-headline-xl text-headline-xl uppercase text-primary font-bold">
              Shop By Sport & Equipment
            </h2>
            <p className="text-body-sm text-on-surface-variant max-w-xl mt-1">
              Select a discipline below to view accurate tournament equipment, rackets, willow bats, leather balls, and footwear.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategorySlug('all')}
              className={`px-3 py-1.5 rounded-full font-label-caps text-xs uppercase font-bold transition-all cursor-pointer ${
                selectedCategorySlug === 'all'
                  ? 'bg-primary-fixed text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface border border-surface-variant'
              }`}
            >
              All Disciplines ({ALL_PRODUCTS.length})
            </button>
            <Link
              to="/shop"
              className="font-label-caps text-label-caps text-primary-fixed uppercase hover:underline flex items-center gap-1 font-bold text-xs ml-2"
            >
              <span>Full Catalog</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </div>
        </div>

        {/* 8 Category Discipline Cards with Accurate Items Tags */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-space-xl">
          {categories.map((cat) => {
            const isSelected = selectedCategorySlug === cat.slug;
            const accurateCount = ALL_PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;

            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setSelectedCategorySlug(cat.slug)}
                className={`relative rounded-xl p-3 flex flex-col items-center text-center gap-2 transition-all overflow-hidden text-left group cursor-pointer border ${
                  isSelected
                    ? 'border-primary-fixed bg-surface-container-high shadow-[0_0_20px_rgba(204,255,0,0.15)] ring-1 ring-primary-fixed scale-[1.02]'
                    : 'border-surface-variant/40 bg-surface-container hover:bg-surface-container-high hover:border-outline-variant hover:scale-[1.02]'
                }`}
              >
                {/* Visual Discipline Photo Background Thumbnail */}
                <div className="w-full h-16 rounded-lg overflow-hidden relative bg-surface-container-lowest shadow-inner mb-1">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
                  <div className="absolute bottom-1 left-1.5 flex items-center gap-1">
                    <span className={`material-symbols-outlined text-base ${isSelected ? 'text-primary-fixed font-bold' : 'text-primary'}`}>
                      {cat.icon || 'sports'}
                    </span>
                  </div>
                  <span className="absolute top-1 right-1 bg-black/60 backdrop-blur-xs text-primary-fixed font-mono text-[9px] px-1.5 py-0.5 rounded font-bold">
                    {accurateCount} Items
                  </span>
                </div>

                <div className="w-full">
                  <span className={`font-headline-md text-headline-md uppercase block font-bold text-xs truncate ${
                    isSelected ? 'text-primary-fixed' : 'text-primary group-hover:text-on-surface'
                  }`}>
                    {cat.name}
                  </span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant block truncate mt-0.5 leading-tight">
                    {cat.accurateItems || `${accurateCount} gear items`}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* ACCURATE ITEMS SHELF FOR SELECTED CATEGORY */}
        <div className="bg-surface-container-low rounded-2xl p-space-md sm:p-space-lg border border-surface-container-high/80 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-md mb-space-md border-b border-surface-container-high">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary flex items-center justify-center font-bold shadow-md">
                <span className="material-symbols-outlined text-xl">
                  {selectedCategorySlug === 'all' ? 'inventory_2' : (activeCategory?.icon || 'sports')}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-md text-base sm:text-lg uppercase text-primary font-bold tracking-tight">
                    {selectedCategorySlug === 'all' ? 'All Tournament Equipment' : `${activeCategory?.name} Gear & Equipment`}
                  </h3>
                  <span className="bg-surface-container-high text-primary-fixed text-[10px] font-mono px-2 py-0.5 rounded font-bold border border-primary-fixed/20">
                    {categoryProducts.length} Verified Items
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {selectedCategorySlug === 'all'
                    ? 'Showing comprehensive sports equipment across all disciplines.'
                    : `Accurate tournament items: ${activeCategory?.accurateItems || 'Professional match gear'}`}
                </p>
              </div>
            </div>

            <Link
              to={selectedCategorySlug === 'all' ? '/shop' : `/shop?category=${activeCategory?.slug}`}
              className="inline-flex items-center gap-1 text-xs font-label-caps uppercase text-primary-fixed hover:underline font-bold bg-surface-container px-3 py-1.5 rounded-lg border border-surface-variant hover:border-primary-fixed/40 transition-colors self-start sm:self-auto"
            >
              <span>Explore All {selectedCategorySlug === 'all' ? 'Items' : activeCategory?.name} in Shop</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Accurate Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
            {categoryProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="group relative bg-surface-container rounded-xl overflow-hidden border border-surface-container-high/60 hover:border-primary-fixed/60 transition-all flex flex-col justify-between shadow-md cursor-pointer hover:-translate-y-1 duration-300"
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
                  <span className="absolute top-2 right-2 bg-surface-container-high/90 backdrop-blur-sm text-primary-fixed text-[10px] font-mono px-2 py-0.5 rounded font-bold border border-surface-variant">
                    {product.categoryName}
                  </span>
                  {product.weightGrams > 0 && (
                    <span className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-on-surface text-[10px] font-mono px-2 py-0.5 rounded">
                      {product.weightGrams}g
                    </span>
                  )}
                </div>

                {/* Info Container */}
                <div className="p-space-sm sm:p-space-md flex flex-col flex-1 justify-between gap-space-sm">
                  <div>
                    <span className="font-label-sm text-[10px] uppercase text-on-surface-variant tracking-wider block font-mono">
                      {product.brand} • {product.sku}
                    </span>
                    <h4 className="font-title-base text-body-sm sm:text-base text-primary uppercase font-bold group-hover:text-primary-fixed transition-colors line-clamp-2 mt-0.5 leading-snug">
                      {product.title}
                    </h4>
                  </div>

                  {/* Rating & Stock */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-surface-container-high/50">
                    <div className="flex items-center gap-1 text-primary-fixed font-bold font-mono">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span>{product.rating}</span>
                      <span className="text-[10px] text-on-surface-variant font-normal">({product.reviewCount})</span>
                    </div>
                    <span className="text-[11px] text-green-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> In Stock
                    </span>
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex items-center justify-between pt-space-xs">
                    <div className="flex flex-col">
                      <span className="text-primary-fixed font-headline-md font-bold text-base sm:text-lg">
                        {formatCurrency(product.price)}
                      </span>
                      {product.msrp > product.price && (
                        <span className="text-on-surface-variant line-through text-[11px] font-mono">
                          {formatCurrency(product.msrp)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, product)}
                      className="px-3 py-1.5 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-label-caps text-xs uppercase font-bold rounded shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                      title="Add to Cart"
                    >
                      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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

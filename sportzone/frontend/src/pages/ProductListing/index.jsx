import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';

export const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Active filter state from query parameters
  const selectedCategory = searchParams.get('category') || '';
  const selectedSort = searchParams.get('sort') || 'featured';
  const searchQuery = searchParams.get('query') || '';
  const brandParam = searchParams.get('brand') || '';
  const inStockParam = searchParams.get('inStock') === 'true';

  // Grid view column state: '4col', '3col', 'list'
  const [viewMode, setViewMode] = useState('4col');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getAllCategories();
        setCategories(cats || []);
      } catch (err) {
        setCategories([
          { id: 1, name: 'Running', slug: 'running', itemCount: 342 },
          { id: 2, name: 'Football', slug: 'football', itemCount: 218 },
          { id: 3, name: 'Cricket', slug: 'cricket', itemCount: 164 },
          { id: 4, name: 'Basketball', slug: 'basketball', itemCount: 129 },
          { id: 5, name: 'Tennis', slug: 'tennis', itemCount: 108 },
          { id: 6, name: 'Gym & Fitness', slug: 'gym-fitness', itemCount: 195 },
          { id: 7, name: 'Cycling', slug: 'cycling', itemCount: 92 },
        ]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const params = {
          category: selectedCategory || undefined,
          sort: selectedSort,
          query: searchQuery || undefined,
          brand: brandParam || undefined,
          inStock: inStockParam ? true : undefined,
          page: 0,
          size: 24,
        };

        const res = await productService.getProducts(params);
        if (res && res.content) {
          setProducts(res.content);
          setTotalItems(res.totalElements || res.content.length);
        } else {
          fallbackProducts();
        }
      } catch (err) {
        console.error('Error fetching catalog:', err);
        fallbackProducts();
      } finally {
        setLoading(false);
      }
    };

    const fallbackProducts = () => {
      const defaultCatalog = [
        {
          id: 1,
          title: 'CarbonVolt Strider Road Racing Shoes',
          slug: 'carbonvolt-strider-road-racing-shoes',
          sku: 'SZ-CV-88219',
          price: 199.99,
          msrp: 220.00,
          discountPercentage: 9,
          brand: 'Apex Athletic',
          categorySlug: 'running',
          categoryName: 'Running',
          inStock: true,
          rating: 4.95,
          reviewCount: 142,
          primaryImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKmDVOu-fCXOb_FraoY84dlcYkkrDTbQZobWus_qgHS8e7_2XyC-6TmpSuUvF3xB5pm2lhwQiZ5HI4pM0IhV5iK_mw9m3Y8ixoAz2P_bsJ8Yh9MHAesN-blLKIK0_SD7wSrG0Q5Dv1S7VPxFY95pEXRFmp-OrI_fBc-g5istAzBGByBdjl7b4-mdaJPooYLqQIMNWsF8_OAeE0Qjl1KltPQw-234DqQ6vfy1raW6vD-M0wi0e5E72L',
        },
        {
          id: 2,
          title: 'Pro Match Thermal Bonded Football Size 5',
          slug: 'pro-match-thermal-bonded-football-size-5',
          sku: 'SZ-FB-55420',
          price: 79.99,
          msrp: 99.99,
          discountPercentage: 20,
          brand: 'Apex Athletic',
          categorySlug: 'football',
          categoryName: 'Football',
          inStock: true,
          rating: 4.88,
          reviewCount: 94,
          primaryImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEwRzCkqve6Jvrm4Jkc8I6sbS3E_QVSf_poeGCB3l9-SvTmf2D0OBpwa9BpVt24Fjs34X4xCUeN5uQZiUVekuAn-8hAeObk9Z3jwE-T_8MNSVuSfkH3WHEVsfmV2m3C0OpXMnwcmH5nZVb5WxvE6LB0iQs96X4Dp0EcK7HD_rlcH6S9AHcswwbTDlvYuGjnxefIZLjfosuc984-3o22GcEKULu4z6-0qJ8Ku8ojQmv7eAuNF2uziY9',
        },
        {
          id: 3,
          title: 'Apex Pro Elite Carbon Cricket Bat',
          slug: 'apex-pro-elite-carbon-cricket-bat',
          sku: 'SZ-CR-99101',
          price: 289.99,
          msrp: 320.00,
          discountPercentage: 10,
          brand: 'Apex Athletic',
          categorySlug: 'cricket',
          categoryName: 'Cricket',
          inStock: true,
          rating: 4.92,
          reviewCount: 68,
          primaryImageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1U1O0QJq0k7J-D3PAeMH_ig1t4sP4XufEo0m_25P1vpN3i1znnB9CFWCfbu2zt1u8ThXNVNoypoJFqWAqYK6-nBZe-_WRRsbafrKfbiOvlLKYw5SF4MDxQWNAclH7f4qwgo3qarSx-it4zTX5LsZ9JRODii8j5BsAyskKuM1a6OOT-WTWkysYH7wtmWukc-e5wlbimcKYeyB8gBbdwaXDf7qOhODbFSN7j8PC0LdwdD0_cdAZ8RdUxwplg',
        },
        {
          id: 4,
          title: 'CourtVelocity HyperGrip Basketball Shoes',
          slug: 'courtvelocity-hypergrip-basketball-shoes',
          sku: 'SZ-BB-33201',
          price: 159.99,
          msrp: 180.00,
          discountPercentage: 11,
          brand: 'Apex Athletic',
          categorySlug: 'basketball',
          categoryName: 'Basketball',
          inStock: true,
          rating: 4.84,
          reviewCount: 81,
          primaryImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdN4TwH3ZN4LFzRVxJt2v6JZvc9jWnbiIPvCI8BZ1eFBA61zg8QKa4csYdekFc95WzkMj7SdFhDRdYnRBih3eMwYPXUh6AupdrGxQD9-aINGiR2T80GPhVb_aSvGCgHGa89R6muY-bxE0UngYZnHS1e27eN_F66mfAE31CY_P9uOPA-Szk8qanUbtwiCmjmwSzmiU9n07Ay6CZLb7TN4rLrUPh0dXG_bZE8Ldh7u92D9Zy3jbFewPq',
        },
        {
          id: 5,
          title: 'Aeroflex Court Pro 98 Tennis Racket',
          slug: 'aeroflex-court-pro-98-tennis-racket',
          sku: 'SZ-TN-44102',
          price: 219.99,
          msrp: 249.99,
          discountPercentage: 12,
          brand: 'Apex Athletic',
          categorySlug: 'tennis',
          categoryName: 'Tennis',
          inStock: true,
          rating: 4.90,
          reviewCount: 53,
          primaryImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEbx1R6cWtQINCkizgrUTpUs6PBPK7vuYRQus0qu_3b_tkQOIYbukJ_0S9RLgS8O6-z26X8_4QEmML9RxgnMjm58rFFwL9yE4xseFqLvNCazViClmbBmtvIZRzbSrK1lY0CVWbI3VAe0JjjrKSpkrNQc9_HyrojbOPnX3rYlqNoqbxfeQ1gA6IJCxusuoP8fJVp19B592l3dChjRKL2W1jhHgfD1oqeU7Mpwu6KvOfA1_cAggNNWVQ',
        },
        {
          id: 6,
          title: 'Kinetic Velocity 2-in-1 Compression Shorts',
          slug: 'kinetic-velocity-2-in-1-compression-shorts',
          sku: 'SZ-AP-11002',
          price: 49.99,
          msrp: 60.00,
          discountPercentage: 17,
          brand: 'Apex Athletic',
          categorySlug: 'gym-fitness',
          categoryName: 'Gym & Fitness',
          inStock: true,
          rating: 4.79,
          reviewCount: 110,
          primaryImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJTthylbmgq7TeXam-LqdYujXC8yXBMgp_I3TMRseslcs3uj1S7yJ_JA0iEkQfXWGeiH_JBWnXkN80PnQx-SSC9oqIe0LWE-nVCxa7qR8-GBZTdAPlkU0fgkmm7YaB4tUZWZAa-w3-1vCqW2a3Mx07yBw3m-zxFsKDUJ5FLuSQjD0pMwmy-JG14o_ukflaxo6BbBQphjoEAEUdE29wZuQBu3UIjg2Sk_iKq3MyYxTTfY6FxEeDbORR',
        },
      ];

      // Filter locally if fallback
      let filtered = defaultCatalog;
      if (selectedCategory) {
        filtered = filtered.filter((p) => p.categorySlug === selectedCategory);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter((p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
      }
      setProducts(filtered);
      setTotalItems(filtered.length);
    };

    fetchCatalog();
  }, [selectedCategory, selectedSort, searchQuery, brandParam, inStockParam]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const handleQuickAdd = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id, null, 1, product);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Banner / Breadcrumb Bar */}
      <div className="w-full bg-surface-container-low py-space-sm px-space-md lg:px-space-xl border-b border-surface-container-high/60">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
          <div className="flex items-center gap-space-xs">
            <Link to="/" className="hover:text-primary-fixed transition-colors">
              Home
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <Link to="/shop" className="hover:text-primary-fixed transition-colors">
              Shop
            </Link>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-on-surface font-semibold">
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory
                : 'All Sports & Gear'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-space-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></span>
              24h Express Dispatch
            </span>
            <span>•</span>
            <span>30-Day Pro Trial</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto w-full px-space-md lg:px-space-xl pt-space-lg pb-space-2xl">
        {/* Page Header & Sort / View Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pb-space-lg">
          <div>
            <div className="flex items-center gap-space-xs text-primary-fixed font-label-caps text-label-caps uppercase mb-1">
              <span className="material-symbols-outlined text-sm">tune</span>
              <span>Performance Catalog • 2025 Series</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl uppercase text-primary tracking-wide flex flex-wrap items-baseline gap-space-sm font-bold">
              PRO SPORTS GEAR & APPAREL
              <span className="font-headline-md text-headline-md text-on-surface-variant font-normal">
                (Showing {totalItems} Items)
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-space-md justify-between lg:justify-end">
            {/* Sort Selector */}
            <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-sm py-2 rounded-lg border border-surface-container-high shadow-sm">
              <span className="material-symbols-outlined text-base text-on-surface-variant">sort</span>
              <label htmlFor="sort-select" className="font-label-caps text-label-caps uppercase text-on-surface-variant text-xs font-bold">
                Sort:
              </label>
              <select
                id="sort-select"
                value={selectedSort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-transparent font-body-sm text-body-sm font-semibold text-on-surface focus:outline-none cursor-pointer"
              >
                <option className="bg-surface-container-high text-on-surface" value="featured">Featured & Pro Pick</option>
                <option className="bg-surface-container-high text-on-surface" value="price-asc">Price: Low to High</option>
                <option className="bg-surface-container-high text-on-surface" value="price-desc">Price: High to Low</option>
                <option className="bg-surface-container-high text-on-surface" value="rating">Highest Rated</option>
                <option className="bg-surface-container-high text-on-surface" value="newest">Newest Arrivals</option>
                <option className="bg-surface-container-high text-on-surface" value="discount">Discount %</option>
              </select>
            </div>

            {/* View Layout Switcher */}
            <div className="hidden sm:flex items-center bg-surface-container-lowest rounded-lg p-1 shadow-sm gap-1 border border-surface-container-high">
              <button
                onClick={() => setViewMode('3col')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === '3col' ? 'bg-surface-container-high text-primary-fixed shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="3 Columns"
              >
                <span className="material-symbols-outlined text-lg">view_compact</span>
              </button>
              <button
                onClick={() => setViewMode('4col')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === '4col' ? 'bg-surface-container-high text-primary-fixed shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="4 Columns"
              >
                <span className="material-symbols-outlined text-lg">grid_view</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-surface-container-high text-primary-fixed shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="List View"
              >
                <span className="material-symbols-outlined text-lg">view_list</span>
              </button>
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-space-xs bg-primary-fixed text-on-primary font-label-caps text-label-caps px-space-md py-2 rounded uppercase font-bold"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              Filters
            </button>
          </div>
        </div>

        {/* Active Filters Pills */}
        {(selectedCategory || searchQuery || brandParam || inStockParam) && (
          <div className="flex flex-wrap items-center gap-space-xs py-space-sm mb-space-lg bg-surface-container-low px-space-md rounded-xl border border-surface-container-high/60">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant text-xs mr-space-xs font-bold">
              Active:
            </span>

            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface font-body-sm text-body-sm px-space-sm py-1 rounded-full">
                Sport: <strong className="text-primary-fixed capitalize">{selectedCategory}</strong>
                <button onClick={() => updateFilter('category', '')} className="hover:text-secondary-fixed transition-colors flex items-center">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface font-body-sm text-body-sm px-space-sm py-1 rounded-full">
                Search: <strong className="text-primary-fixed">{searchQuery}</strong>
                <button onClick={() => updateFilter('query', '')} className="hover:text-secondary-fixed transition-colors flex items-center">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </span>
            )}

            {brandParam && (
              <span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface font-body-sm text-body-sm px-space-sm py-1 rounded-full">
                Brand: <strong className="text-primary-fixed">{brandParam}</strong>
                <button onClick={() => updateFilter('brand', '')} className="hover:text-secondary-fixed transition-colors flex items-center">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </span>
            )}

            {inStockParam && (
              <span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface font-body-sm text-body-sm px-space-sm py-1 rounded-full">
                Stock: <strong className="text-primary-fixed">In Stock Only</strong>
                <button onClick={() => updateFilter('inStock', '')} className="hover:text-secondary-fixed transition-colors flex items-center">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="font-label-caps text-label-caps text-secondary uppercase hover:underline ml-space-sm font-bold text-xs"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Catalog 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Filter Sidebar (Desktop & Mobile Drawer) */}
          <aside className={`lg:block lg:col-span-3 sticky top-28 bg-surface-container-lowest rounded-xl p-space-md space-y-space-lg shadow-md border border-surface-container-high/60 ${mobileFilterOpen ? 'block fixed inset-0 z-50 overflow-y-auto bg-surface p-6' : 'hidden'}`}>
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary-fixed">tune</span>
                <span className="font-headline-md text-headline-md uppercase text-primary font-bold">Filters</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={clearAllFilters} className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed underline">
                  Reset
                </button>
                {mobileFilterOpen && (
                  <button onClick={() => setMobileFilterOpen(false)} className="lg:hidden p-1 text-primary">
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-space-xs">
              <h2 className="font-label-caps text-label-caps uppercase text-on-surface tracking-wider font-bold text-xs">
                Sport Category
              </h2>
              <div className="space-y-1 text-on-surface font-body-sm text-body-sm">
                <label
                  onClick={() => updateFilter('category', '')}
                  className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
                    !selectedCategory ? 'bg-surface-container text-primary-fixed font-bold' : 'hover:bg-surface-container'
                  }`}
                >
                  <span>All Sports</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded">
                    {totalItems}
                  </span>
                </label>
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    onClick={() => updateFilter('category', selectedCategory === cat.slug ? '' : cat.slug)}
                    className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition-colors ${
                      selectedCategory === cat.slug ? 'bg-surface-container text-primary-fixed font-bold' : 'hover:bg-surface-container'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat.slug}
                        readOnly
                        className="accent-primary-fixed w-4 h-4 rounded"
                      />
                      <span>{cat.name}</span>
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded">
                      {cat.itemCount || 100}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-space-xs pt-space-md border-t border-surface-container-high">
              <h2 className="font-label-caps text-label-caps uppercase text-on-surface tracking-wider font-bold text-xs">
                Brand
              </h2>
              <div className="space-y-1 text-on-surface font-body-sm text-body-sm">
                {['Apex Athletic', 'ProCircuit', 'AeroSpeed', 'CarbonForce'].map((brand) => (
                  <label
                    key={brand}
                    onClick={() => updateFilter('brand', brandParam === brand ? '' : brand)}
                    className="flex items-center justify-between p-1.5 rounded hover:bg-surface-container cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={brandParam === brand}
                        readOnly
                        className="accent-primary-fixed w-4 h-4 rounded"
                      />
                      <span>{brand}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="pt-space-md border-t border-surface-container-high">
              <label
                onClick={() => updateFilter('inStock', !inStockParam)}
                className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-surface-container"
              >
                <input
                  type="checkbox"
                  checked={inStockParam}
                  readOnly
                  className="accent-primary-fixed w-4 h-4 rounded"
                />
                <span className="font-body-sm text-body-sm text-on-surface font-medium">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid (9 cols on desktop) */}
          <main className="lg:col-span-9 flex flex-col gap-space-lg">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <span className="material-symbols-outlined text-4xl text-primary-fixed animate-spin">sync</span>
                <p className="font-label-caps text-label-caps uppercase text-sm text-on-surface-variant">
                  Loading Precision Catalog...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-surface-container-low rounded-xl p-12 text-center border border-surface-container-high">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-2">search_off</span>
                <h3 className="font-headline-lg text-primary uppercase font-bold">No Products Found</h3>
                <p className="text-on-surface-variant text-sm mt-1 mb-4">
                  No gear matches the selected combination of filters.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-primary-fixed text-on-primary font-label-caps uppercase rounded font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === 'list'
                    ? 'flex flex-col gap-space-md'
                    : viewMode === '3col'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-space-lg'
                    : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-lg'
                }
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    className={`group relative bg-surface-container rounded-xl overflow-hidden border border-surface-container-high/60 hover:border-primary-fixed/60 transition-all shadow-md cursor-pointer ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col justify-between'
                    }`}
                  >
                    {/* Image Area */}
                    <div
                      className={`relative bg-surface-container-lowest overflow-hidden ${
                        viewMode === 'list' ? 'w-full sm:w-60 aspect-[4/3] sm:aspect-auto' : 'w-full aspect-[4/3]'
                      }`}
                    >
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

                    {/* Details */}
                    <div className="p-space-md flex flex-col flex-1 justify-between gap-space-xs">
                      <div>
                        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant text-[11px] tracking-wider block">
                          {product.categoryName || 'PRO SPORT'}
                        </span>
                        <h3 className="font-title-base text-title-base text-primary uppercase font-bold truncate group-hover:text-primary-fixed transition-colors">
                          {product.title}
                        </h3>
                        {viewMode === 'list' && (
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        <span className="font-bold text-on-surface">{product.rating}</span>
                        <span>({product.reviewCount || 42})</span>
                      </div>

                      {/* Price & CTA */}
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
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;

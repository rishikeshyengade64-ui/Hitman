import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import useCart from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';
import { ALL_CATEGORIES, ALL_PRODUCTS } from '../../data/catalog';

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
  const [showFilters, setShowFilters] = useState(true);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (brandParam ? 1 : 0) +
    (inStockParam ? 1 : 0);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getAllCategories();
        setCategories(cats && cats.length > 0 ? cats : ALL_CATEGORIES);
      } catch (err) {
        setCategories(ALL_CATEGORIES);
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
      let filtered = [...ALL_PRODUCTS];
      if (selectedCategory) {
        filtered = filtered.filter((p) => p.categorySlug === selectedCategory);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter((p) => 
          p.title.toLowerCase().includes(q) || 
          p.brand.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q))
        );
      }
      if (brandParam) {
        filtered = filtered.filter((p) => p.brand.toLowerCase() === brandParam.toLowerCase());
      }
      if (inStockParam) {
        filtered = filtered.filter((p) => p.inStock);
      }

      if (selectedSort === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (selectedSort === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (selectedSort === 'rating') {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
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

  const renderFilterContent = () => (
    <>
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
          {categories.map((cat) => {
            const catCount = ALL_PRODUCTS.filter((p) => p.categorySlug === cat.slug).length;
            return (
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
                    className="accent-primary-fixed w-4 h-4 rounded cursor-pointer"
                  />
                  <span>{cat.name}</span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded">
                  {catCount}
                </span>
              </label>
            );
          })}
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
                  className="accent-primary-fixed w-4 h-4 rounded cursor-pointer"
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
            className="accent-primary-fixed w-4 h-4 rounded cursor-pointer"
          />
          <span className="font-body-sm text-body-sm text-on-surface font-medium">In Stock Only</span>
        </label>
      </div>
    </>
  );

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
              {selectedCategory
                ? `${categories.find((c) => c.slug === selectedCategory)?.name?.toUpperCase() || selectedCategory.toUpperCase()} GEAR`
                : 'PRO SPORTS GEAR & APPAREL'}
              <span className="font-headline-md text-headline-md text-on-surface-variant font-normal">
                (Showing {totalItems} Items)
              </span>
            </h1>
            {selectedCategory && categories.find((c) => c.slug === selectedCategory)?.accurateItems && (
              <p className="text-xs text-primary-fixed mt-1 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed"></span>
                <span>Discipline Equipment: <strong>{categories.find((c) => c.slug === selectedCategory)?.accurateItems}</strong></span>
              </p>
            )}
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

            {/* Three-Dot Filter Trigger Button */}
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileFilterOpen(true);
                } else {
                  setShowFilters((prev) => !prev);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border font-label-caps text-xs uppercase font-bold transition-all shadow-sm cursor-pointer select-none ${
                showFilters
                  ? 'bg-surface-container-lowest text-primary border-surface-container-high hover:bg-surface-container'
                  : 'bg-primary-fixed text-on-primary border-primary-fixed hover:bg-primary-fixed-dim'
              }`}
              title={showFilters ? 'Hide Filters' : 'Show Filters'}
              aria-label={showFilters ? 'Hide Filters' : 'Show Filters'}
            >
              <span className="material-symbols-outlined text-xl leading-none font-bold">more_vert</span>
              <span className="hidden sm:inline">{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              <span className="sm:hidden">Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-0.5 w-4 h-4 rounded-full bg-secondary-container text-on-secondary-container text-[10px] flex items-center justify-center font-bold font-mono">
                  {activeFilterCount}
                </span>
              )}
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

        {/* Mobile Filter Slide-Over Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-primary/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileFilterOpen(false)}
            />

            {/* Slide-over panel */}
            <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-surface shadow-2xl flex flex-col z-10 animate-slide-in-right">
              {/* Header */}
              <div className="p-4 border-b border-surface-container-high flex items-center justify-between bg-surface-container-lowest">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary-fixed text-xl">more_vert</span>
                  <h2 className="font-headline-md uppercase text-primary font-bold text-base">Filters</h2>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container text-xs flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-on-surface-variant hover:text-primary-fixed underline"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
                    aria-label="Close filters"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
              </div>

              {/* Filter List Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {renderFilterContent()}
              </div>

              {/* Bottom Action Footer */}
              <div className="p-4 border-t border-surface-container-high bg-surface-container-lowest flex gap-2">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-2.5 px-3 border border-surface-container-high text-primary font-label-caps uppercase text-xs font-bold rounded-lg hover:bg-surface-container transition-colors"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 px-3 bg-primary-fixed text-on-primary font-label-caps uppercase text-xs font-bold rounded-lg hover:bg-primary-fixed-dim transition-colors shadow"
                >
                  Show ({totalItems})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Desktop Filter Sidebar */}
          {showFilters && (
            <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-surface-container-lowest rounded-xl p-space-md space-y-space-lg shadow-sm border border-surface-container-high/60 transition-all duration-300">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary-fixed text-xl">more_vert</span>
                  <span className="font-headline-md text-headline-md uppercase text-primary font-bold">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container text-xs flex items-center justify-center font-bold font-mono">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary-fixed underline"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    title="Hide Filters"
                    className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              </div>

              {renderFilterContent()}
            </aside>
          )}

          {/* Product Grid (conditionally 9 or 12 cols on desktop) */}
          <main className={`${showFilters ? 'lg:col-span-9' : 'lg:col-span-12'} flex flex-col gap-space-lg transition-all duration-300`}>
            {/* Desktop Notification Banner when filters are collapsed */}
            {!showFilters && (
              <div className="hidden lg:flex items-center justify-between p-3 px-4 bg-surface-container-low border border-surface-container-high/70 rounded-xl shadow-xs">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <span className="material-symbols-outlined text-primary-fixed text-lg">more_vert</span>
                  <span>Filters are currently collapsed for full-width grid view.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-1 text-xs font-label-caps uppercase font-bold text-primary-fixed hover:text-primary-fixed-dim underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">more_vert</span>
                  Show Filters
                </button>
              </div>
            )}

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
                    ? showFilters
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-space-lg'
                      : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-lg'
                    : showFilters
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-lg'
                    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-space-lg'
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

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import useCart from '../../hooks/useCart';
import { formatCurrency, formatNormalSize, formatIndianSize } from '../../utils/formatters';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('9');
  const [selectedColor, setSelectedColor] = useState('Volt Neon / Obsidian');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id || 1);
        if (data) {
          setProduct(data);
          if (data.variants && data.variants.length > 0) {
            setSelectedSize(formatNormalSize(data.variants[0].size));
            setSelectedColor(data.variants[0].color);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        // Fallback product matching Stitch screen exactly
        setProduct({
          id: 1,
          title: 'CarbonVolt Strider Road Racing Shoes',
          slug: 'carbonvolt-strider-road-racing-shoes',
          sku: 'SZ-CV-88219',
          description:
            'Engineered for elite marathoners and road racers seeking maximum velocity and explosive energy return. Features a full-length 3K curved carbon fiber propulsion plate sandwiched between twin layers of ultra-resilient AeroFoam+ cushioning.',
          price: 199.99,
          msrp: 220.00,
          discountPercentage: 9,
          brand: 'Apex Athletic',
          categoryName: 'Running Footwear',
          rating: 4.95,
          reviewCount: 142,
          inStock: true,
          stockQuantity: 85,
          weightGrams: 215,
          midsoleTech: 'AeroFoam+ Max',
          propulsionUnit: '100% 3K Carbon',
          dropHeightMm: 8.0,
          images: [
            {
              id: 1,
              imageUrl:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDKmDVOu-fCXOb_FraoY84dlcYkkrDTbQZobWus_qgHS8e7_2XyC-6TmpSuUvF3xB5pm2lhwQiZ5HI4pM0IhV5iK_mw9m3Y8ixoAz2P_bsJ8Yh9MHAesN-blLKIK0_SD7wSrG0Q5Dv1S7VPxFY95pEXRFmp-OrI_fBc-g5istAzBGByBdjl7b4-mdaJPooYLqQIMNWsF8_OAeE0Qjl1KltPQw-234DqQ6vfy1raW6vD-M0wi0e5E72L',
              angleLabel: 'Lateral',
            },
            {
              id: 2,
              imageUrl:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDaqi-yAQlSfg6TLXnEBvTl_iv8IZDQgtEbtbghzsCWEzcsH7nffgTPakQmPxKQHaVTVEB0Xiah0S5NSoayRKDC6yHh8jxkoDe9gFpFVzJiwSphj_825to1Pt_-FAUBF-w0ogS6MdTH4uF8v4xWis4cEFsOOXS_DCwQdH-Rj7tL-jyi-_3EIUI6qJjgsVKZJPGKfZy9r0iCmZw6CKKYKlyEzFoWSMSCswk2IYAupzMjWTL-2b6Fvt7_',
              angleLabel: 'Medial',
            },
            {
              id: 3,
              imageUrl:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ_ez5fMBgxDxnyNudMrAUkz-WVl75AV7uZyx0qm6Ty7hoUbRAJc07ZmmizKXODdcxCrUyGu3veaWoMXtwZkeYk9el81ICMj0zbOOB6WakDr-RkLGGGN25cuIru333YxN-f3FaNBeA01qjbDn-yhHekuRUe7iIMzHOMIcAp2Ym7gdn74ND2o0MWfcdnhaonQdufbLNlAmy6_vJiRUXyt6ZOIzWEgzdQiyapLhGiQBHptNcyj7tNRna',
              angleLabel: 'Toe-Box',
            },
            {
              id: 4,
              imageUrl:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuC0zr3x9IGi1KIfQuKfi5JqURbZGho_mKtFI4ZM8hdUlBJQ-CFseKPRklCMH0ED2yZkCF-t3VcJVsGETzZkzGXoR-QTcCtkiu7kgGL9r6an-__MXIMCa9N2dpsiWcjPnx3Pj7_4lipW9_E50M9t67_fIaFDJi6hDNmQQkmx9_WHYa3BQX8puKQmaCfsxhvDiuwTIhMAAztp5yJzFBRD1uhF3iu1Io9hrb4kcH8c5XINl60O0b3TdjC3',
              angleLabel: 'Carbon Outsole',
            },
            {
              id: 5,
              imageUrl:
                'https://lh3.googleusercontent.com/aida-public/AB6AXuAEbx1R6cWtQINCkizgrUTpUs6PBPK7vuYRQus0qu_3b_tkQOIYbukJ_0S9RLgS8O6-z26X8_4QEmML9RxgnMjm58rFFwL9yE4xseFqLvNCazViClmbBmtvIZRzbSrK1lY0CVWbI3VAe0JjjrKSpkrNQc9_HyrojbOPnX3rYlqNoqbxfeQ1gA6IJCxusuoP8fJVp19B592l3dChjRKL2W1jhHgfD1oqeU7Mpwu6KvOfA1_cAggNNWVQ',
              angleLabel: 'In Motion',
            },
          ],
          variants: [
            { id: 1, size: '7', color: 'Volt Neon / Obsidian', stockQuantity: 15 },
            { id: 2, size: '7.5', color: 'Volt Neon / Obsidian', stockQuantity: 12 },
            { id: 3, size: '8', color: 'Volt Neon / Obsidian', stockQuantity: 20 },
            { id: 4, size: '8.5', color: 'Volt Neon / Obsidian', stockQuantity: 18 },
            { id: 5, size: '9', color: 'Volt Neon / Obsidian', stockQuantity: 25 },
            { id: 6, size: '9.5', color: 'Volt Neon / Obsidian', stockQuantity: 14 },
            { id: 7, size: '10', color: 'Volt Neon / Obsidian', stockQuantity: 10 },
            { id: 8, size: '11', color: 'Volt Neon / Obsidian', stockQuantity: 8 },
          ],
          reviews: [
            {
              id: 1,
              reviewerName: 'Marcus V.',
              rating: 5,
              title: 'Shaved 4 minutes off my marathon PR',
              comment:
                'The carbon plate propulsion and AeroFoam stack is revolutionary. Stiff, responsive, but saves your quads over 26.2 miles.',
              verifiedPurchase: true,
              createdAt: '2025-08-14T10:00:00',
            },
            {
              id: 2,
              reviewerName: 'Elena R.',
              rating: 5,
              title: 'Pure athletic engineering mastery',
              comment:
                'Light as a feather (215g on my scale) and the volt accents look stadium-grade under stadium lights.',
              verifiedPurchase: true,
              createdAt: '2025-08-20T15:30:00',
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    const variant = product.variants?.find((v) => formatNormalSize(v.size) === selectedSize || v.size === selectedSize);
    await addToCart(product.id, variant?.id || null, quantity, {
      ...product,
      selectedSize,
      selectedColor,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <span className="material-symbols-outlined text-4xl text-primary-fixed animate-spin">sync</span>
        <p className="font-label-caps uppercase text-sm text-on-surface-variant">Loading Product Telemetry...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold uppercase text-primary">Product Not Found</h2>
        <Link to="/shop" className="text-primary-fixed underline mt-4 inline-block font-label-caps">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [{ id: 1, imageUrl: product.primaryImageUrl, angleLabel: 'Main' }];

  const currentImage = galleryImages[selectedImageIndex] || galleryImages[0];

  return (
    <div className="flex flex-col w-full">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-fixed text-on-primary px-space-md py-3 rounded-xl shadow-2xl font-label-caps uppercase font-bold flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined">check_circle</span>
          Added {quantity}x {product.title} to your cart!
        </div>
      )}

      {/* Breadcrumb Bar */}
      <div className="w-full bg-surface-container-lowest/80 backdrop-blur-md border-b border-surface-container-high/60">
        <div className="max-w-[1440px] mx-auto px-space-md lg:px-space-xl py-space-sm flex items-center justify-between">
          <nav className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-primary-fixed transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">home</span>
              Home
            </Link>
            <span className="material-symbols-outlined text-xs text-outline-variant">chevron_right</span>
            <Link to="/shop" className="hover:text-primary-fixed transition-colors">
              Shop
            </Link>
            <span className="material-symbols-outlined text-xs text-outline-variant">chevron_right</span>
            <span className="text-on-surface font-semibold truncate">{product.title}</span>
          </nav>
          <div className="hidden md:flex items-center gap-space-sm text-on-surface-variant font-label-caps text-label-caps text-xs">
            <span className="inline-flex items-center gap-1 text-primary-fixed font-bold">
              <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></span>
              28 Viewers Right Now
            </span>
            <span className="text-surface-variant">•</span>
            <span>SKU: {product.sku}</span>
          </div>
        </div>
      </div>

      {/* Primary PDP Grid */}
      <section className="max-w-[1440px] mx-auto w-full px-space-md lg:px-space-xl py-space-lg lg:py-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-2xl items-start">
          {/* Left Column: Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-md sticky lg:top-28">
            {/* Main Interactive Viewport */}
            <div className="relative w-full aspect-[4/3] rounded-xl bg-surface-container overflow-hidden group shadow-2xl flex items-center justify-center border border-surface-container-high/60">
              {/* Badges Overlay */}
              <div className="absolute top-space-md left-space-md z-20 flex flex-col gap-space-2xs items-start pointer-events-none">
                <span className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps uppercase px-space-sm py-1 rounded shadow-md tracking-wider font-bold">
                  PREMIUM SELECTION
                </span>
                <span className="bg-surface-container-high/90 text-primary-fixed font-label-caps text-[11px] uppercase px-space-sm py-0.5 rounded backdrop-blur-md flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-xs text-primary-fixed">verified</span>
                  FREE SHIPPING & 30-DAY WEAR TEST
                </span>
              </div>

              {/* Quick Action Zoom & 360 Indicator */}
              <div className="absolute top-space-md right-space-md z-20 flex items-center gap-space-xs">
                <button
                  className="bg-surface-container-highest/80 hover:bg-surface-bright text-on-surface p-2 rounded-lg backdrop-blur-md transition-all shadow-md"
                  title="Zoom View"
                >
                  <span className="material-symbols-outlined text-lg">zoom_in</span>
                </button>
                <div className="bg-surface-container-highest/80 text-primary-fixed px-space-sm py-1.5 rounded-lg font-label-caps text-label-caps flex items-center gap-1 backdrop-blur-md text-xs font-bold">
                  <span className="material-symbols-outlined text-sm animate-spin" style={{ animationDuration: '8s' }}>
                    sync
                  </span>
                  360° VIEW
                </div>
              </div>

              {/* Main Image View */}
              <div className="w-full h-full relative transition-transform duration-500 ease-out group-hover:scale-105">
                <img
                  src={currentImage.imageUrl}
                  alt={currentImage.altText || product.title}
                  className="w-full h-full object-cover select-none"
                />
              </div>

              {/* Telemetry Pill Overlay */}
              <div className="absolute bottom-space-md left-space-md right-space-md z-20 flex items-center justify-between pointer-events-none">
                <div className="bg-surface-container-lowest/80 backdrop-blur-md px-space-sm py-1.5 rounded-lg flex items-center gap-space-sm text-on-surface-variant font-label-caps text-xs">
                  <span className="flex items-center gap-1 text-on-surface">
                    <span className="material-symbols-outlined text-xs text-primary-fixed">weight</span>
                    {product.weightGrams || 215}g RACE WEIGHT
                  </span>
                  <span className="text-surface-variant">•</span>
                  <span className="flex items-center gap-1 text-on-surface">
                    <span className="material-symbols-outlined text-xs text-secondary">flash_on</span>
                    DUAL CARBON WING
                  </span>
                </div>
                <span className="bg-surface-container-lowest/80 backdrop-blur-md px-space-xs py-1 rounded text-[10px] font-mono text-on-surface-variant">
                  ANGLE 0{selectedImageIndex + 1} / 0{galleryImages.length}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip (5 Angles) */}
            <div className="grid grid-cols-5 gap-space-sm">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`group relative rounded-lg bg-surface-container p-1 aspect-square overflow-hidden transition-all border ${
                    selectedImageIndex === idx
                      ? 'border-primary-fixed bg-surface-container-highest shadow-md scale-105'
                      : 'border-surface-container-high hover:border-outline'
                  }`}
                >
                  <img src={img.imageUrl} alt={img.angleLabel} className="w-full h-full object-cover rounded" />
                  <span className="absolute bottom-1 inset-x-1 text-[9px] font-label-caps uppercase text-center bg-surface-container-lowest/80 text-primary-fixed rounded py-0.5 pointer-events-none font-bold">
                    {img.angleLabel}
                  </span>
                </button>
              ))}
            </div>

            {/* Telemetry Spec Snapshot Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs mt-space-xs">
              <div className="bg-surface-container p-space-sm rounded-lg flex flex-col gap-1 border border-surface-container-high/60">
                <span className="text-[10px] font-label-caps text-on-surface-variant uppercase font-bold">Propulsion Unit</span>
                <span className="font-headline-md text-base text-on-surface font-bold">{product.propulsionUnit || '100% 3K Carbon'}</span>
              </div>
              <div className="bg-surface-container p-space-sm rounded-lg flex flex-col gap-1 border border-surface-container-high/60">
                <span className="text-[10px] font-label-caps text-on-surface-variant uppercase font-bold">Midsole Tech</span>
                <span className="font-headline-md text-base text-primary-fixed font-bold">{product.midsoleTech || 'AeroFoam+ Max'}</span>
              </div>
              <div className="bg-surface-container p-space-sm rounded-lg flex flex-col gap-1 border border-surface-container-high/60">
                <span className="text-[10px] font-label-caps text-on-surface-variant uppercase font-bold">Energy Return</span>
                <span className="font-headline-md text-base text-secondary font-bold">88.4% Lab Lab</span>
              </div>
              <div className="bg-surface-container p-space-sm rounded-lg flex flex-col gap-1 border border-surface-container-high/60">
                <span className="text-[10px] font-label-caps text-on-surface-variant uppercase font-bold">Drop Height</span>
                <span className="font-headline-md text-base text-on-surface font-bold">{product.dropHeightMm || 8.0} mm Offset</span>
              </div>
            </div>
          </div>

          {/* Right Column: Purchasing Controls & Details (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Lab Brand & Authenticity */}
            <div className="flex items-center justify-between gap-space-sm">
              <span className="bg-surface-container-high px-space-xs py-1 rounded text-primary-fixed font-label-caps text-xs tracking-wider uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">science</span>
                SPORTZONE LABS PERFORMANCE
              </span>
              <span className="inline-flex items-center gap-0.5 text-tertiary-fixed text-xs font-body-sm">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                Pro Certified
              </span>
            </div>

            {/* Title & SKU */}
            <div>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant text-xs tracking-wider">
                {product.categoryName} • {product.brand}
              </span>
              <h1 className="font-headline-xl text-headline-xl uppercase text-primary font-bold tracking-tight mt-1">
                {product.title}
              </h1>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-space-md pb-space-sm border-b border-surface-container-high/60">
              <span className="font-display-hero text-headline-xl text-primary font-extrabold">
                {formatCurrency(product.price)}
              </span>
              {product.msrp && (
                <span className="font-title-base text-title-base text-on-surface-variant line-through">
                  {formatCurrency(product.msrp)}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="bg-secondary-container text-on-secondary-container font-label-caps text-xs uppercase px-2 py-0.5 rounded font-bold">
                  Save {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Product Overview Description */}
            <p className="font-body-md text-body-md text-on-surface-variant">
              {product.description}
            </p>

            {/* Color Option Selection */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-caps text-label-caps uppercase text-xs text-on-surface-variant font-bold">
                Colorway: <strong className="text-primary">{selectedColor}</strong>
              </span>
              <div className="flex items-center gap-space-xs">
                {['Volt Neon / Obsidian', 'Ghost White / Cyan', 'Stealth Black'].map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3 py-1.5 rounded text-xs font-label-caps uppercase font-bold transition-all border ${
                      selectedColor === col
                        ? 'border-primary-fixed bg-surface-container-high text-primary-fixed'
                        : 'border-surface-container-high bg-surface-container-lowest text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Telemetry Size Selector - Standard Sizing */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-xs text-on-surface-variant font-bold flex items-center gap-1.5">
                  <span>Select Size:</span>
                  <span className="text-primary-fixed font-bold">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="font-label-caps text-label-caps text-xs text-primary-fixed uppercase underline hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">straighten</span>
                  <span>Size Chart</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-space-xs">
                {(product.variants?.length > 0
                  ? product.variants
                  : [
                      { size: '7' },
                      { size: '7.5' },
                      { size: '8' },
                      { size: '8.5' },
                      { size: '9' },
                      { size: '9.5' },
                      { size: '10' },
                      { size: '11' },
                    ]
                ).map((v) => {
                  const displaySize = formatNormalSize(v.size);
                  const isSelected = selectedSize === displaySize || selectedSize === v.size;
                  return (
                    <button
                      key={v.id || v.size}
                      type="button"
                      onClick={() => setSelectedSize(displaySize)}
                      className={`h-11 rounded font-headline-md text-sm font-bold transition-all border flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-primary-fixed text-on-primary border-primary-fixed shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                          : 'bg-surface-container-lowest border-surface-container-high text-primary hover:bg-surface-container'
                      }`}
                    >
                      <span>{displaySize}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart Controls */}
            <div className="flex flex-col gap-space-sm pt-space-md border-t border-surface-container-high/60">
              <div className="flex items-center gap-space-md">
                {/* Stepper */}
                <div className="flex items-center bg-surface-container-lowest rounded border border-surface-container-high px-2 py-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-on-surface hover:text-primary-fixed text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-headline-md text-lg text-primary font-bold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-on-surface hover:text-primary-fixed text-lg font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-space-lg bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-headline-md text-headline-md uppercase font-bold rounded shadow-[0_0_24px_rgba(204,255,0,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-space-xs"
                >
                  <span className="material-symbols-outlined font-bold">shopping_bag</span>
                  <span>ADD TO RACING CART • {formatCurrency(product.price * quantity)}</span>
                </button>
              </div>

              {/* Instant Buy Now */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3 bg-surface-container hover:bg-surface-container-high text-primary font-headline-md text-headline-md uppercase font-bold rounded border border-surface-variant transition-colors"
              >
                PRO CHECKOUT NOW
              </button>
            </div>

            {/* Reviews Summary Tab */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="mt-space-md bg-surface-container rounded-xl p-space-md border border-surface-container-high">
                <span className="font-headline-md text-headline-md uppercase text-primary font-bold block mb-space-xs">
                  Verified Athlete Reviews ({product.reviews.length})
                </span>
                <div className="space-y-space-sm">
                  {product.reviews.map((rev) => (
                    <div key={rev.id} className="border-b border-surface-container-high/40 pb-space-xs last:border-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-primary">{rev.reviewerName}</span>
                        <div className="flex items-center text-primary-fixed">
                          {'★'.repeat(rev.rating)}
                        </div>
                      </div>
                      <h4 className="font-bold text-sm text-on-surface mt-0.5">{rev.title}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Size Chart Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed">straighten</span>
                <h3 className="font-headline-lg text-lg uppercase text-primary font-bold">
                  Footwear Size Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="text-on-surface-variant hover:text-primary text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-on-surface-variant mt-3 mb-4">
              Standard size guide. Match your measurement to select the optimal racing fit.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-surface-container-high text-primary-fixed uppercase font-label-caps">
                    <th className="py-2 px-3">Size</th>
                    <th className="py-2 px-3">US Men</th>
                    <th className="py-2 px-3">Euro (EU)</th>
                    <th className="py-2 px-3">Foot Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/60 text-on-surface">
                  {[
                    { size: '6', us: 'US 7', eu: '40', cm: '25.0 cm' },
                    { size: '7', us: 'US 8', eu: '41', cm: '25.5 cm' },
                    { size: '7.5', us: 'US 8.5', eu: '42', cm: '26.0 cm' },
                    { size: '8', us: 'US 9', eu: '42.5', cm: '26.5 cm' },
                    { size: '8.5', us: 'US 9.5', eu: '43', cm: '27.0 cm' },
                    { size: '9', us: 'US 10', eu: '44', cm: '27.5 cm' },
                    { size: '9.5', us: 'US 10.5', eu: '44.5', cm: '28.0 cm' },
                    { size: '10', us: 'US 11', eu: '45', cm: '28.5 cm' },
                    { size: '11', us: 'US 12', eu: '46', cm: '29.5 cm' },
                  ].map((row) => (
                    <tr
                      key={row.size}
                      className={`hover:bg-surface-container-high/50 transition-colors ${
                        selectedSize === row.size ? 'bg-primary-fixed/10 font-bold text-primary-fixed' : ''
                      }`}
                    >
                      <td className="py-2 px-3 font-bold text-primary">{row.size}</td>
                      <td className="py-2 px-3">{row.us}</td>
                      <td className="py-2 px-3">{row.eu}</td>
                      <td className="py-2 px-3 font-mono">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="px-5 py-2 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-bold text-xs uppercase rounded transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailsPage;

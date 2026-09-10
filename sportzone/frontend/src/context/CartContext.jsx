import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/cartService';
import { promoService } from '../services/promoService';
import { useAuth } from './AuthContext';
import { storage } from '../utils/storage';
import { formatNormalSize } from '../utils/formatters';

export const CartContext = createContext(null);

const DEFAULT_DEMO_ITEMS = [
  {
    id: 1,
    productId: 1,
    variantId: 5,
    productTitle: 'CarbonVolt Strider Road Racing Shoes',
    productSlug: 'carbonvolt-strider-road-racing-shoes',
    sku: 'SZ-CV-88219',
    categoryName: 'RUNNING / MARATHON PRO',
    variantSize: '9',
    variantColor: 'Volt Neon / Obsidian',
    quantity: 1,
    unitPrice: 199.99,
    msrp: 220.00,
    itemTotal: 199.99,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDKmDVOu-fCXOb_FraoY84dlcYkkrDTbQZobWus_qgHS8e7_2XyC-6TmpSuUvF3xB5pm2lhwQiZ5HI4pM0IhV5iK_mw9m3Y8ixoAz2P_bsJ8Yh9MHAesN-blLKIK0_SD7wSrG0Q5Dv1S7VPxFY95pEXRFmp-OrI_fBc-g5istAzBGByBdjl7b4-mdaJPooYLqQIMNWsF8_OAeE0Qjl1KltPQw-234DqQ6vfy1raW6vD-M0wi0e5E72L',
  },
  {
    id: 2,
    productId: 2,
    variantId: null,
    productTitle: 'Pro Match Thermal Bonded Football Size 5',
    productSlug: 'pro-match-thermal-bonded-football-size-5',
    sku: 'SZ-FB-55420',
    categoryName: 'FOOTBALL / OFFICIAL MATCH',
    variantSize: 'Size 5',
    variantColor: 'Match White/Volt',
    quantity: 1,
    unitPrice: 79.99,
    msrp: 99.99,
    itemTotal: 79.99,
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBEwRzCkqve6Jvrm4Jkc8I6sbS3E_QVSf_poeGCB3l9-SvTmf2D0OBpwa9BpVt24Fjs34X4xCUeN5uQZiUVekuAn-8hAeObk9Z3jwE-T_8MNSVuSfkH3WHEVsfmV2m3C0OpXMnwcmH5nZVb5WxvE6LB0iQs96X4Dp0EcK7HD_rlcH6S9AHcswwbTDlvYuGjnxefIZLjfosuc984-3o22GcEKULu4z6-0qJ8Ku8ojQmv7eAuNF2uziY9',
  },
];

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(() => {
    const saved = storage.getCart();
    return saved !== null ? saved : DEFAULT_DEMO_ITEMS;
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [promoCode, setPromoCode] = useState('SPORT20'); // Initialized with default promo
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(20);
  const [promoDiscountAmount, setPromoDiscountAmount] = useState(0);
  const [shippingTier, setShippingTier] = useState('EXPRESS_STANDARD'); // 'EXPRESS_STANDARD' or 'APEX_OVERNIGHT'

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast((curr) => (curr === message ? null : curr));
    }, 3200);
  };

  // Fetch cart from backend when user is authenticated, retaining local fallback
  const refreshCart = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await cartService.getCart();
      if (data && data.items && data.items.length > 0) {
        setItems(data.items);
        storage.setCart(data.items);
      }
    } catch (err) {
      console.info('Backend cart sync offline, keeping active local athlete cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, variantId = null, quantity = 1, productDetails = null) => {
    const rawSize = productDetails?.selectedSize || productDetails?.variantSize || productDetails?.size || '';
    const cleanSize = formatNormalSize(rawSize);
    const cleanColor = productDetails?.selectedColor || productDetails?.variantColor || 'Volt Neon / Obsidian';
    const primaryImg =
      productDetails?.primaryImageUrl ||
      productDetails?.imageUrl ||
      (productDetails?.images && productDetails.images[0]?.imageUrl) ||
      '';
    const productTitle = productDetails?.title || productDetails?.productTitle || 'SportGear Pro Item';
    const unitPrice = Number(productDetails?.price || productDetails?.unitPrice || 199.99);

    let nextItems;
    const existingIndex = items.findIndex(
      (i) =>
        i.productId === productId &&
        ((variantId != null && i.variantId === variantId) ||
          (cleanSize && i.variantSize === cleanSize) ||
          (!cleanSize && !i.variantSize))
    );

    if (existingIndex > -1) {
      nextItems = items.map((item, idx) => {
        if (idx === existingIndex) {
          const newQty = item.quantity + quantity;
          return {
            ...item,
            quantity: newQty,
            itemTotal: newQty * item.unitPrice,
          };
        }
        return item;
      });
    } else {
      const newItem = {
        id: Date.now(),
        productId,
        variantId,
        productTitle,
        productSlug: productDetails?.slug || productDetails?.productSlug || '',
        sku: productDetails?.sku || `SZ-${productId}-${Date.now().toString().slice(-4)}`,
        categoryName: productDetails?.categoryName || 'PRO ATHLETIC',
        variantSize: cleanSize || 'Standard',
        variantColor: cleanColor,
        quantity,
        unitPrice,
        msrp: Number(productDetails?.msrp || 220.0),
        itemTotal: unitPrice * quantity,
        imageUrl: primaryImg,
      };
      nextItems = [newItem, ...items];
    }

    setItems(nextItems);
    storage.setCart(nextItems);
    showToast(`Added ${quantity}x ${productTitle} to your cart!`);

    // Sync with backend if authenticated and server is responsive
    if (isAuthenticated) {
      try {
        const data = await cartService.addToCart(productId, variantId, quantity);
        if (data && data.items && data.items.length > 0) {
          setItems(data.items);
          storage.setCart(data.items);
        }
      } catch (err) {
        console.warn('Backend cart sync offline, item retained in local athlete cart:', err.message || err);
      }
    }

    return true;
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeItem(itemId);
    }
    const updated = items.map((i) =>
      i.id === itemId
        ? { ...i, quantity: newQuantity, itemTotal: newQuantity * i.unitPrice }
        : i
    );
    setItems(updated);
    storage.setCart(updated);

    if (isAuthenticated) {
      try {
        const data = await cartService.updateQuantity(itemId, newQuantity);
        if (data && data.items) {
          setItems(data.items);
          storage.setCart(data.items);
        }
      } catch (err) {
        console.warn('Backend update quantity sync skipped:', err.message || err);
      }
    }
  };

  const removeItem = async (itemId) => {
    const updated = items.filter((i) => i.id !== itemId);
    setItems(updated);
    storage.setCart(updated);

    if (isAuthenticated) {
      try {
        const data = await cartService.removeItem(itemId);
        if (data && data.items) {
          setItems(data.items);
          storage.setCart(data.items);
        }
      } catch (err) {
        console.warn('Backend removeItem sync skipped:', err.message || err);
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    storage.clearCart();

    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.warn('Backend clearCart sync skipped:', err.message || err);
      }
    }
  };

  const applyPromo = async (code) => {
    if (!code) return { success: false, message: 'Please enter a promo code' };
    try {
      const res = await promoService.validatePromo(code, subtotal);
      if (res.valid) {
        setPromoCode(res.code);
        setPromoDiscountPercent(res.discountPercent || 0);
        setPromoDiscountAmount(res.discountAmount || 0);
        return { success: true, message: res.message };
      } else {
        return { success: false, message: res.message };
      }
    } catch (err) {
      // Fallback evaluation for demo/offline
      if (code.toUpperCase() === 'SPORT20') {
        setPromoCode('SPORT20');
        setPromoDiscountPercent(20);
        return { success: true, message: 'SPORT20 applied (20% OFF)!' };
      }
      return { success: false, message: 'Invalid promo code.' };
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setPromoDiscountPercent(0);
    setPromoDiscountAmount(0);
  };

  // Computations
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

  const discountAmount =
    promoDiscountPercent > 0 ? (subtotal * promoDiscountPercent) / 100 : promoDiscountAmount;

  const afterDiscount = Math.max(0, subtotal - discountAmount);

  // Shipping logic: free over ₹999 for standard; ₹149 for overnight
  const isOvernight = shippingTier === 'APEX_OVERNIGHT' || shippingTier === 'OVERNIGHT';
  const shippingAmount = isOvernight ? 149.0 : subtotal >= 999.0 ? 0.0 : 99.0;

  // Tax: 18% GST standard on afterDiscount
  const taxAmount = +(afterDiscount * 0.18).toFixed(2);

  const totalAmount = +(afterDiscount + shippingAmount + taxAmount).toFixed(2);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        discountAmount,
        shippingAmount,
        taxAmount,
        totalAmount,
        promoCode,
        promoDiscountPercent,
        shippingTier,
        setShippingTier,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyPromo,
        removePromo,
        refreshCart,
        showToast,
      }}
    >
      {children}
      {/* Global floating toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-surface-container-lowest border border-primary-fixed/40 text-on-surface px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md font-label-caps uppercase font-bold flex items-center gap-3 animate-fadeIn">
          <span className="material-symbols-outlined text-primary-fixed text-xl">check_circle</span>
          <span className="text-xs sm:text-sm tracking-wide text-primary">{toast}</span>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

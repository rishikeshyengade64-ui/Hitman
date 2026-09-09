import React, { createContext, useState, useEffect, useContext } from 'react';
import { cartService } from '../services/cartService';
import { promoService } from '../services/promoService';
import { useAuth } from './AuthContext';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('SPORT20'); // Initialized with Stitch default promo
  const [promoDiscountPercent, setPromoDiscountPercent] = useState(20);
  const [promoDiscountAmount, setPromoDiscountAmount] = useState(0);
  const [shippingTier, setShippingTier] = useState('EXPRESS_STANDARD'); // 'EXPRESS_STANDARD' or 'APEX_OVERNIGHT'

  // Fetch cart from backend when user is authenticated
  const refreshCart = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setItems(data.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      // Demo items if not authenticated yet, matching Stitch UI screen
      setItems([
        {
          id: 1,
          productId: 1,
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
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKmDVOu-fCXOb_FraoY84dlcYkkrDTbQZobWus_qgHS8e7_2XyC-6TmpSuUvF3xB5pm2lhwQiZ5HI4pM0IhV5iK_mw9m3Y8ixoAz2P_bsJ8Yh9MHAesN-blLKIK0_SD7wSrG0Q5Dv1S7VPxFY95pEXRFmp-OrI_fBc-g5istAzBGByBdjl7b4-mdaJPooYLqQIMNWsF8_OAeE0Qjl1KltPQw-234DqQ6vfy1raW6vD-M0wi0e5E72L',
        },
        {
          id: 2,
          productId: 2,
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
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEwRzCkqve6Jvrm4Jkc8I6sbS3E_QVSf_poeGCB3l9-SvTmf2D0OBpwa9BpVt24Fjs34X4xCUeN5uQZiUVekuAn-8hAeObk9Z3jwE-T_8MNSVuSfkH3WHEVsfmV2m3C0OpXMnwcmH5nZVb5WxvE6LB0iQs96X4Dp0EcK7HD_rlcH6S9AHcswwbTDlvYuGjnxefIZLjfosuc984-3o22GcEKULu4z6-0qJ8Ku8ojQmv7eAuNF2uziY9',
        },
      ]);
    }
  }, [isAuthenticated]);

  const addToCart = async (productId, variantId = null, quantity = 1, productDetails = null) => {
    if (isAuthenticated) {
      try {
        const data = await cartService.addToCart(productId, variantId, quantity);
        setItems(data.items || []);
        return true;
      } catch (err) {
        console.error('Error adding to cart:', err);
        throw err;
      }
    } else {
      // Local state fallback
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.productId === productId && i.variantId === variantId);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantity;
          updated[existingIndex].itemTotal = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
          return updated;
        } else {
          const newItem = {
            id: Date.now(),
            productId,
            productTitle: productDetails?.title || 'SportGear Pro Item',
            productSlug: productDetails?.slug || '',
            sku: productDetails?.sku || 'SZ-GEN-01',
            categoryName: productDetails?.categoryName || 'PRO ATHLETIC',
            variantSize: productDetails?.selectedSize || 'Standard',
            variantColor: productDetails?.selectedColor || 'Volt Neon',
            quantity,
            unitPrice: productDetails?.price || 199.99,
            msrp: productDetails?.msrp || 220.00,
            itemTotal: (productDetails?.price || 199.99) * quantity,
            imageUrl: productDetails?.primaryImageUrl || '',
          };
          return [newItem, ...prev];
        }
      });
      return true;
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeItem(itemId);
    }
    if (isAuthenticated) {
      try {
        const data = await cartService.updateQuantity(itemId, newQuantity);
        setItems(data.items || []);
      } catch (err) {
        console.error('Error updating cart quantity:', err);
      }
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.id === itemId
            ? { ...i, quantity: newQuantity, itemTotal: newQuantity * i.unitPrice }
            : i
        )
      );
    }
  };

  const removeItem = async (itemId) => {
    if (isAuthenticated) {
      try {
        const data = await cartService.removeItem(itemId);
        setItems(data.items || []);
      } catch (err) {
        console.error('Error removing item from cart:', err);
      }
    } else {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setItems([]);
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    } else {
      setItems([]);
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
  const subtotal = items.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);

  const discountAmount = promoDiscountPercent > 0
    ? (subtotal * promoDiscountPercent) / 100
    : promoDiscountAmount;

  const afterDiscount = Math.max(0, subtotal - discountAmount);

  // Shipping logic: free over $99 for standard; $14.99 for overnight
  const isOvernight = shippingTier === 'APEX_OVERNIGHT' || shippingTier === 'OVERNIGHT';
  const shippingAmount = isOvernight ? 14.99 : (subtotal >= 99.0 ? 0.0 : 9.99);

  // Tax: 6.5% on afterDiscount
  const taxAmount = +(afterDiscount * 0.065).toFixed(2);

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
      }}
    >
      {children}
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

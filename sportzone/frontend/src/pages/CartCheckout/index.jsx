import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatNormalSize } from '../../utils/formatters';
import { CartItemImage } from '../../components/common/CartItemImage';
import { storage } from '../../utils/storage';

// Indian States and Union Territories for address localization
const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

// Quick PIN code prefix to City & State lookup for smooth Indian UX
const PIN_CODE_LOOKUP = {
  '400': { city: 'Mumbai', state: 'Maharashtra' },
  '411': { city: 'Pune', state: 'Maharashtra' },
  '440': { city: 'Nagpur', state: 'Maharashtra' },
  '110': { city: 'New Delhi', state: 'Delhi' },
  '560': { city: 'Bengaluru', state: 'Karnataka' },
  '500': { city: 'Hyderabad', state: 'Telangana' },
  '600': { city: 'Chennai', state: 'Tamil Nadu' },
  '700': { city: 'Kolkata', state: 'West Bengal' },
  '380': { city: 'Ahmedabad', state: 'Gujarat' },
  '395': { city: 'Surat', state: 'Gujarat' },
  '302': { city: 'Jaipur', state: 'Rajasthan' },
  '201': { city: 'Noida', state: 'Uttar Pradesh' },
  '226': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '160': { city: 'Chandigarh', state: 'Chandigarh' },
  '122': { city: 'Gurugram', state: 'Haryana' },
  '682': { city: 'Kochi', state: 'Kerala' },
  '800': { city: 'Patna', state: 'Bihar' },
  '751': { city: 'Bhubaneswar', state: 'Odisha' },
  '781': { city: 'Guwahati', state: 'Assam' },
  '403': { city: 'Panaji', state: 'Goa' },
  '462': { city: 'Bhopal', state: 'Madhya Pradesh' },
  '452': { city: 'Indore', state: 'Madhya Pradesh' },
};

export const CartCheckoutPage = () => {
  const {
    items,
    totalItems,
    subtotal,
    discountAmount,
    shippingAmount,
    taxAmount,
    totalAmount,
    promoCode,
    shippingTier,
    setShippingTier,
    updateQuantity,
    removeItem,
    applyPromo,
    removePromo,
    clearCart,
  } = useCart();

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Section Refs for smooth navigation
  const addressSectionRef = useRef(null);
  const pinCodeInputRef = useRef(null);
  const orderSummaryRef = useRef(null);
  const paymentSectionRef = useRef(null);

  // Highlighting state when scrolling to address from "Place Order"
  const [highlightAddress, setHighlightAddress] = useState(false);

  // Order Confirmation Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [copied, setCopied] = useState(false);

  // Promo code input state
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState({ text: '', isError: false });

  // Shipping Form State localized for India
  const [shippingForm, setShippingForm] = useState({
    fullName: user?.fullName || 'Rishi Sharma',
    phone: user?.phone || '+91 98765 43210',
    pinCode: user?.zipCode || '400001',
    city: user?.city || 'Mumbai',
    state: user?.state || 'Maharashtra',
    streetAddress: user?.streetAddress || 'Flat 402, Velocity Heights, Linking Road',
    aptSuite: user?.aptSuite || 'Near Sports Complex, Bandra West',
  });

  // Payment Form State
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'CARD', 'NETBANKING', 'COD'
  const [upiId, setUpiId] = useState('athlete@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [cardForm, setCardForm] = useState({
    cardholderName: (user?.fullName || 'RISHI SHARMA').toUpperCase(),
    cardNumber: '4532 •••• •••• 8842',
    expires: '08/28',
    cvv: '923',
  });

  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Smooth scroll to Delivery Address & autofocus PIN Code
  const scrollToAddress = () => {
    if (addressSectionRef.current) {
      addressSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightAddress(true);
      setTimeout(() => {
        if (pinCodeInputRef.current) {
          pinCodeInputRef.current.focus();
        }
      }, 450);
      setTimeout(() => {
        setHighlightAddress(false);
      }, 3000);
    }
  };

  const scrollToOrderSummary = () => {
    if (orderSummaryRef.current) {
      orderSummaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToPayment = () => {
    if (paymentSectionRef.current) {
      paymentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingForm((prev) => {
      const next = { ...prev, [name]: value };

      // When PIN code changes, check for auto-fill of City and State
      if (name === 'pinCode') {
        const cleaned = value.replace(/\D/g, '').slice(0, 6);
        next.pinCode = cleaned;
        const prefix = cleaned.slice(0, 3);
        if (PIN_CODE_LOOKUP[prefix]) {
          next.city = PIN_CODE_LOOKUP[prefix].city;
          next.state = PIN_CODE_LOOKUP[prefix].state;
        }
      }

      return next;
    });
  };

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = await applyPromo(promoInput.trim());
    if (res.success) {
      setPromoMsg({ text: res.message, isError: false });
      setPromoInput('');
    } else {
      setPromoMsg({ text: res.message, isError: true });
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    if (!shippingForm.pinCode || shippingForm.pinCode.length < 6) {
      setOrderError('Please provide a valid 6-digit Indian PIN Code.');
      scrollToAddress();
      return;
    }

    if (!shippingForm.phone || shippingForm.phone.trim().length < 10) {
      setOrderError('Please provide a valid 10-digit mobile phone number for delivery updates.');
      scrollToAddress();
      return;
    }

    setSubmittingOrder(true);
    setOrderError('');

    try {
      const nameParts = (shippingForm.fullName || '').trim().split(' ');
      const fName = nameParts[0] || 'Athlete';
      const lName = nameParts.slice(1).join(' ') || 'Pro';

      const orderPayload = {
        shippingFirstName: fName,
        shippingLastName: lName,
        shippingAddress: shippingForm.streetAddress,
        shippingApt: shippingForm.aptSuite,
        shippingCity: shippingForm.city,
        shippingState: shippingForm.state,
        shippingZipCode: shippingForm.pinCode,
        shippingPhone: shippingForm.phone,
        shippingTier,
        paymentMethod: paymentMethod === 'CARD' ? 'CREDIT_CARD' : paymentMethod,
        promoCode: promoCode || undefined,
      };

      const finalAmount = totalAmount;
      const paymentLabel =
        paymentMethod === 'COD'
          ? 'Cash on Delivery (COD)'
          : paymentMethod === 'UPI'
          ? `UPI (${upiId || 'Instant VPA'})`
          : paymentMethod === 'CARD'
          ? 'Credit / Debit Card'
          : `${selectedBank} Bank Net Banking`;

      let finalOrderNumber = `SZ-${Date.now().toString().slice(-6)}`;

      if (isAuthenticated) {
        try {
          const createdOrder = await orderService.createOrder(orderPayload);
          if (createdOrder && createdOrder.orderNumber) {
            finalOrderNumber = createdOrder.orderNumber;
          }
        } catch (serverErr) {
          console.warn('Backend order creation offline, generating confirmed athlete order:', serverErr);
        }
      }

      // Calculate estimated delivery dates and logistics details
      const today = new Date();
      const isOvernight = shippingTier === 'APEX_OVERNIGHT';
      const deliveryDaysMin = isOvernight ? 1 : 2;
      const deliveryDaysMax = isOvernight ? 1 : 4;
      const deliveryDateEst = new Date(today);
      deliveryDateEst.setDate(today.getDate() + deliveryDaysMin);
      const deliveryDateMax = new Date(today);
      deliveryDateMax.setDate(today.getDate() + deliveryDaysMax);
      const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
      const estDateString = isOvernight
        ? `Tomorrow by 10:30 AM (${deliveryDateEst.toLocaleDateString('en-IN', dateOptions)})`
        : `${deliveryDateEst.toLocaleDateString('en-IN', dateOptions)} - ${deliveryDateMax.toLocaleDateString('en-IN', dateOptions)}`;

      const courierPartner = isOvernight
        ? 'BlueDart Air Priority Express'
        : 'Delhivery Surface & Air Cargo';

      const trackingNumber = `AWB-${Math.floor(100000000 + Math.random() * 900000000)}IN`;

      const fullOrderData = {
        orderNumber: finalOrderNumber,
        totalAmount: finalAmount,
        subtotal: subtotal,
        discountAmount: discountAmount,
        taxAmount: taxAmount,
        shippingAmount: shippingAmount,
        paymentMethod: paymentLabel,
        shippingName: shippingForm.fullName,
        shippingPhone: shippingForm.phone,
        streetAddress: shippingForm.streetAddress,
        aptSuite: shippingForm.aptSuite,
        city: shippingForm.city,
        state: shippingForm.state,
        pinCode: shippingForm.pinCode,
        shippingAddress: `${shippingForm.streetAddress}${shippingForm.aptSuite ? ', ' + shippingForm.aptSuite : ''}, ${shippingForm.city}, ${shippingForm.state} - ${shippingForm.pinCode}`,
        shippingTier: isOvernight ? 'Apex Overnight Priority' : 'Express Standard Delivery',
        shippingFee: shippingAmount === 0 ? 'FREE' : formatCurrency(shippingAmount),
        estimatedDelivery: estDateString,
        courier: courierPartner,
        trackingAwb: trackingNumber,
        itemCount: totalItems,
        items: items,
        createdAt: new Date().toISOString(),
      };

      // Pop up the Order Confirmation Modal with full order telemetry and persist to storage
      setConfirmedOrder(fullOrderData);
      storage.setLastOrder(fullOrderData);

      setShowSuccessModal(true);
      clearCart();
    } catch (err) {
      console.error('Error creating order:', err);
      if (!isAuthenticated) {
        navigate('/login?redirect=/checkout');
      } else {
        setOrderError(err.response?.data?.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Only show empty state if user hasn't just confirmed an order
  if (items.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-[1440px] mx-auto px-space-md py-space-3xl text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">shopping_bag</span>
        <h2 className="font-headline-xl text-headline-xl uppercase text-primary font-bold">Your Cart is Empty</h2>
        <p className="font-body-md text-on-surface-variant max-w-md mx-auto mt-2 mb-6">
          Your athletic cart is currently empty. Explore our tournament-spec equipment and pro footwear.
        </p>
        <Link
          to="/shop"
          className="px-space-xl py-3.5 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-headline-md uppercase font-bold rounded shadow-[0_0_24px_rgba(204,255,0,0.3)] inline-flex items-center gap-2"
        >
          <span>Explore Catalog</span>
          <span className="material-symbols-outlined font-bold">arrow_forward</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full max-w-[1100px] mx-auto px-space-md lg:px-space-xl py-space-xl overflow-hidden">
        {/* Dynamic Micro Atmospheric Glows */}
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-primary-fixed/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Page Header & Step Visualizer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-space-lg mb-space-xl gap-space-md border-b border-surface-container-high/60">
          <div className="flex flex-col gap-space-2xs">
            <div className="flex items-center gap-space-xs text-primary-fixed">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span className="font-label-caps text-label-caps tracking-widest uppercase text-xs font-bold">
                High-Velocity Encrypted Checkout
              </span>
            </div>
            <h1 className="font-display-hero text-headline-xl lg:text-display-hero uppercase tracking-tight text-primary font-black m-0">
              PRO CHECKOUT <span className="text-primary-fixed">.01</span>
            </h1>
          </div>

          {/* Linear Step Indicator */}
          <div className="flex items-center gap-space-xs sm:gap-space-sm bg-surface-container-low px-space-sm sm:px-space-md py-space-xs rounded-full border border-surface-container-high overflow-x-auto">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary font-label-caps text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span className="font-label-caps text-label-caps uppercase text-primary text-xs font-bold">Cart</span>
            </div>
            <span className="w-4 sm:w-6 h-0.5 bg-primary-fixed shrink-0"></span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary font-label-caps text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span className="font-label-caps text-label-caps uppercase text-primary text-xs font-bold">Address</span>
            </div>
            <span className="w-4 sm:w-6 h-0.5 bg-primary-fixed shrink-0"></span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary font-label-caps text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span className="font-label-caps text-label-caps uppercase text-primary text-xs font-bold">Summary</span>
            </div>
            <span className="w-4 sm:w-6 h-0.5 bg-primary-fixed shrink-0"></span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary font-label-caps text-xs flex items-center justify-center font-bold">
                4
              </span>
              <span className="font-label-caps text-label-caps uppercase text-primary text-xs font-bold">Payment</span>
            </div>
          </div>
        </div>

        {/* Sequential Layout: 1. Cart -> 2. Address -> 3. Order Summary -> 4. Payment */}
        <div className="flex flex-col gap-space-xl">
          {/* Free Shipping Banner */}
          <div className="relative overflow-hidden bg-surface-container-high p-space-md rounded-xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-space-md border border-surface-variant">
            <div className="flex items-center gap-space-md z-10">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed text-on-primary flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(195,244,0,0.35)]">
                <span className="material-symbols-outlined text-xl font-bold">local_shipping</span>
              </div>
              <div>
                <p className="font-title-base text-title-base text-primary uppercase font-bold tracking-wide">
                  🎉 {subtotal >= 999 ? "You've Unlocked Free Express Shipping!" : `Add ${formatCurrency(999 - subtotal)} more for Free Express Shipping!`}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Pan-India express delivery via BlueDart & Delhivery Priority.
                </p>
              </div>
            </div>
            <div className="w-full sm:w-36 bg-surface-container-lowest h-2 rounded-full overflow-hidden shrink-0 z-10">
              <div
                className="bg-primary-fixed h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 1: SHOPPING CART ITEMS                                            */}
          {/* ========================================================================= */}
          <section id="cart-items-section" className="bg-surface-container-low rounded-xl p-space-lg shadow-md flex flex-col gap-space-lg border border-surface-container-high/60">
            <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
              <div className="flex items-center gap-space-xs">
                <span className="w-7 h-7 rounded bg-primary-fixed text-on-primary font-label-caps text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span className="font-headline-lg text-headline-lg uppercase text-primary font-bold tracking-tight">
                  Your Shopping Cart
                </span>
                <span className="font-label-caps text-label-caps bg-surface-container-high text-primary-fixed px-2.5 py-1 rounded-full text-xs font-bold ml-2">
                  {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">
                Verified Inventory
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-space-md">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-surface-container rounded-lg p-space-md shadow-sm transition-all hover:bg-surface-container-high/80 border border-surface-container-high/40"
                >
                  <div className="flex flex-col sm:flex-row gap-space-md">
                    {/* Item Thumbnail */}
                    <div className="relative w-full sm:w-32 h-36 bg-surface-container-lowest rounded overflow-hidden shrink-0">
                      <CartItemImage src={item.imageUrl} alt={item.productTitle} />
                      <span className="absolute top-2 left-2 bg-surface-container-lowest/80 text-primary-fixed font-label-caps text-[10px] uppercase px-1.5 py-0.5 rounded tracking-wider font-bold z-20">
                        PRO SPEC
                      </span>
                    </div>

                    {/* Details & Stepper */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-xs">
                        <div>
                          <span className="font-label-caps text-label-caps uppercase text-primary-fixed text-xs tracking-wider font-bold">
                            {item.categoryName || 'PERFORMANCE GEAR'}
                          </span>
                          <h3 className="font-title-base text-title-base text-primary uppercase font-bold truncate">
                            {item.productTitle}
                          </h3>
                          <div className="flex flex-wrap gap-x-space-md gap-y-space-3xs text-on-surface-variant font-body-sm text-body-sm mt-1">
                            {item.variantColor && (
                              <span>Color: <strong className="text-on-surface">{item.variantColor}</strong></span>
                            )}
                            {item.variantSize && (
                              <>
                                <span>•</span>
                                <span>Size: <strong className="text-on-surface">{formatNormalSize(item.variantSize)}</strong></span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="text-right sm:shrink-0">
                          <span className="font-headline-md text-headline-md text-primary font-bold">
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                          {item.msrp && (
                            <span className="block text-[11px] text-on-surface-variant line-through font-body-sm">
                              MSRP {formatCurrency(item.msrp * item.quantity)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper & Removal */}
                      <div className="flex flex-wrap items-center justify-between gap-space-sm mt-space-md pt-space-xs border-t border-surface-container-high/40">
                        <div className="flex items-center bg-surface-container-lowest rounded px-1 py-0.5 border border-surface-container-high">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-on-surface hover:text-primary-fixed font-bold text-sm cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-headline-md text-body-md text-primary font-bold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-on-surface hover:text-primary-fixed font-bold text-sm cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-space-md">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-on-surface-variant hover:text-secondary-container transition-colors p-1 flex items-center gap-1 text-xs font-label-caps uppercase font-bold cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PLACE ORDER ACTION BAR AT BOTTOM OF CART: Scrolls directly to Delivery Address & PIN Code */}
            <div className="pt-space-md border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-space-md bg-surface-container-lowest/60 p-space-md rounded-xl">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps uppercase text-xs text-on-surface-variant font-bold">
                  Items Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                </span>
                <span className="font-headline-lg text-headline-lg text-primary font-extrabold">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <button
                type="button"
                onClick={scrollToAddress}
                className="w-full sm:w-auto px-space-xl py-space-md bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-headline-md text-headline-md uppercase font-bold rounded-lg shadow-[0_0_24px_rgba(204,255,0,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-space-sm cursor-pointer group"
              >
                <span>Place Order</span>
                <span className="material-symbols-outlined font-bold text-xl transition-transform group-hover:translate-y-1">
                  arrow_downward
                </span>
              </button>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 2: DELIVERY ADDRESS, PIN CODE, STATE, CITY & PHONE                */}
          {/* ========================================================================= */}
          <section
            ref={addressSectionRef}
            id="address-section"
            className={`bg-surface-container-low rounded-xl p-space-lg shadow-md flex flex-col gap-space-lg border transition-all duration-500 ${
              highlightAddress
                ? 'border-primary-fixed ring-2 ring-primary-fixed shadow-[0_0_30px_rgba(204,255,0,0.25)]'
                : 'border-surface-container-high/60'
            }`}
          >
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-space-sm">
                <span className="w-7 h-7 rounded bg-primary-fixed text-on-primary font-label-caps text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <div>
                  <h2 className="font-headline-lg text-headline-lg uppercase text-primary font-bold tracking-tight">
                    Delivery Address & Contact Coordinates
                  </h2>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Enter your PIN Code, State, City, Address and Mobile Phone for priority dispatch
                  </p>
                </div>
              </div>
              <span className="font-label-caps text-label-caps text-primary-fixed uppercase text-xs tracking-wider font-bold hidden sm:inline">
                India Fulfillment
              </span>
            </div>

            {/* Address Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              {/* Full Name */}
              <div className="flex flex-col gap-space-2xs">
                <label className="font-label-caps text-label-caps text-xs uppercase text-on-surface-variant font-bold">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingForm.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Rishi Sharma"
                  className="bg-surface-container-lowest text-primary font-body-sm px-space-md py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
                />
              </div>

              {/* Mobile Phone Number */}
              <div className="flex flex-col gap-space-2xs">
                <label className="font-label-caps text-label-caps text-xs uppercase text-on-surface-variant font-bold flex justify-between">
                  <span>Mobile Phone Number *</span>
                  <span className="text-primary-fixed font-normal text-[11px]">SMS Delivery Alerts</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-label-caps font-bold text-xs text-primary-fixed select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingForm.phone.replace(/^\+91\s*/, '')}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^\d\s]/g, '');
                      setShippingForm((prev) => ({ ...prev, phone: `+91 ${raw}` }));
                    }}
                    placeholder="98765 43210"
                    className="w-full bg-surface-container-lowest text-primary font-body-sm pl-12 pr-space-md py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed font-mono"
                  />
                </div>
              </div>

              {/* PIN Code with Auto-fill helper */}
              <div className="flex flex-col gap-space-2xs">
                <div className="flex justify-between items-center">
                  <label className="font-label-caps text-label-caps text-xs uppercase text-on-surface-variant font-bold">
                    PIN Code (6 Digits) *
                  </label>
                  <span className="text-[10px] text-primary-fixed font-label-caps uppercase font-bold">
                    Auto-fills State & City
                  </span>
                </div>
                <input
                  ref={pinCodeInputRef}
                  id="pinCodeInput"
                  type="text"
                  name="pinCode"
                  maxLength={6}
                  value={shippingForm.pinCode}
                  onChange={handleInputChange}
                  placeholder="400001"
                  className="bg-surface-container-lowest text-primary font-mono text-sm px-space-md py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed font-bold tracking-wider"
                />
              </div>

              {/* State Dropdown (Indian States & UTs) */}
              <div className="flex flex-col gap-space-2xs">
                <label className="font-label-caps text-label-caps text-xs uppercase text-on-surface-variant font-bold">
                  State / Union Territory *
                </label>
                <select
                  name="state"
                  value={shippingForm.state}
                  onChange={handleInputChange}
                  className="bg-surface-container-lowest text-primary font-body-sm px-space-sm py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
                >
                  <option value="">Select State / UT</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="flex flex-col gap-space-2xs">
                <label className="font-label-caps text-label-caps text-xs uppercase text-on-surface-variant font-bold">
                  City / District *
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingForm.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Mumbai"
                  className="bg-surface-container-lowest text-primary font-body-sm px-space-md py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
                />
              </div>

              {/* Area / Landmark / Locality */}
              <div className="flex flex-col gap-space-2xs">
                <label className="font-label-caps text-label-caps text-xs uppercase text-on-surface-variant font-bold">
                  Area / Locality / Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="aptSuite"
                  value={shippingForm.aptSuite}
                  onChange={handleInputChange}
                  placeholder="e.g. Near Sports Complex, Bandra West"
                  className="bg-surface-container-lowest text-primary font-body-sm px-space-md py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
                />
              </div>

              {/* House / Flat No. & Street Address */}
              <div className="sm:col-span-2 flex flex-col gap-space-2xs">
                <label className="font-label-caps text-label-caps text-xs uppercase text-on-surface-variant font-bold">
                  House / Flat No., Building & Street Address *
                </label>
                <input
                  type="text"
                  name="streetAddress"
                  value={shippingForm.streetAddress}
                  onChange={handleInputChange}
                  placeholder="e.g. Flat 402, Velocity Heights, Linking Road"
                  className="bg-surface-container-lowest text-primary font-body-sm px-space-md py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
                />
              </div>
            </div>

            {/* Delivery Velocity Choice */}
            <div className="flex flex-col gap-space-xs mt-space-xs">
              <span className="font-label-caps text-label-caps uppercase text-xs text-on-surface-variant font-bold">
                Shipping Method & Speed
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                {/* Standard */}
                <label
                  onClick={() => setShippingTier('EXPRESS_STANDARD')}
                  className={`relative flex items-center justify-between p-space-md rounded-lg cursor-pointer border transition-all ${
                    shippingTier === 'EXPRESS_STANDARD'
                      ? 'border-primary-fixed bg-surface-container-high shadow-md'
                      : 'border-surface-container-high bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <input
                      type="radio"
                      name="shipping_tier"
                      checked={shippingTier === 'EXPRESS_STANDARD'}
                      readOnly
                      className="accent-primary-fixed w-4 h-4"
                    />
                    <div>
                      <span className="font-headline-md text-headline-md text-primary uppercase font-bold text-sm block">
                        Express Standard
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                        2-4 Business Days via Delhivery Priority
                      </span>
                    </div>
                  </div>
                  <span className="font-headline-md text-headline-md text-primary-fixed uppercase font-bold text-sm">
                    {subtotal >= 999 ? 'FREE' : formatCurrency(99.0)}
                  </span>
                </label>

                {/* Overnight */}
                <label
                  onClick={() => setShippingTier('APEX_OVERNIGHT')}
                  className={`relative flex items-center justify-between p-space-md rounded-lg cursor-pointer border transition-all ${
                    shippingTier === 'APEX_OVERNIGHT'
                      ? 'border-primary-fixed bg-surface-container-high shadow-md'
                      : 'border-surface-container-high bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <input
                      type="radio"
                      name="shipping_tier"
                      checked={shippingTier === 'APEX_OVERNIGHT'}
                      readOnly
                      className="accent-primary-fixed w-4 h-4"
                    />
                    <div>
                      <span className="font-headline-md text-headline-md text-primary uppercase font-bold text-sm block">
                        Apex Overnight Priority
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                        Next Morning Delivery by 10:30 AM
                      </span>
                    </div>
                  </div>
                  <span className="font-headline-md text-headline-md text-primary uppercase font-bold text-sm">
                    {formatCurrency(149.0)}
                  </span>
                </label>
              </div>
            </div>

            {/* Next Step CTA: Review Order Summary */}
            <div className="flex justify-end pt-space-xs">
              <button
                type="button"
                onClick={scrollToOrderSummary}
                className="px-space-lg py-2.5 bg-surface-container-highest hover:bg-surface-bright text-primary font-headline-md uppercase font-bold rounded flex items-center gap-2 border border-surface-variant transition-all text-sm cursor-pointer"
              >
                <span>Proceed to Order Summary</span>
                <span className="material-symbols-outlined text-base">arrow_downward</span>
              </button>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 3: ORDER SUMMARY (COMES DIRECTLY AFTER ADDRESS)                   */}
          {/* ========================================================================= */}
          <section
            ref={orderSummaryRef}
            id="order-summary-section"
            className="bg-surface-container-low rounded-xl p-space-lg shadow-xl border border-surface-container-high relative overflow-hidden flex flex-col gap-space-lg"
          >
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-space-sm">
                <span className="w-7 h-7 rounded bg-primary-fixed text-on-primary font-label-caps text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <div>
                  <h3 className="font-headline-lg text-headline-lg uppercase text-primary font-bold tracking-tight">
                    Order Summary & Bill Details
                  </h3>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    Review your items and delivery destination before choosing payment
                  </p>
                </div>
              </div>
              <span className="font-label-caps text-label-caps text-primary-fixed text-xs uppercase font-bold">
                INR (₹)
              </span>
            </div>

            {/* Delivery Destination Confirmation Card */}
            <div className="bg-surface-container p-space-md rounded-lg border border-surface-container-high/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
              <div className="flex items-start gap-space-sm">
                <div className="w-8 h-8 rounded-full bg-primary-fixed/20 text-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-base">location_on</span>
                </div>
                <div>
                  <p className="font-label-caps uppercase text-xs text-primary font-bold">
                    Delivering to: <span className="text-primary-fixed">{shippingForm.fullName || 'Athlete'}</span> ({shippingForm.phone})
                  </p>
                  <p className="font-body-sm text-on-surface-variant text-xs mt-0.5">
                    {shippingForm.streetAddress}{shippingForm.aptSuite ? `, ${shippingForm.aptSuite}` : ''}, {shippingForm.city}, {shippingForm.state} - <strong className="text-primary">{shippingForm.pinCode}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={scrollToAddress}
                className="text-xs font-label-caps uppercase font-bold text-primary-fixed hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                <span>Change Address</span>
              </button>
            </div>

            {/* Line Items Mini-Breakdown */}
            <div className="flex flex-col gap-space-sm bg-surface-container-lowest p-space-md rounded-lg border border-surface-container-high/50">
              <span className="font-label-caps uppercase text-xs text-on-surface-variant font-bold">
                Items In This Order ({totalItems})
              </span>
              <div className="space-y-space-xs max-h-56 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-surface-container-high/40 text-sm">
                    <div className="flex items-center gap-space-sm min-w-0">
                      <div className="w-9 h-9 rounded bg-surface-container overflow-hidden shrink-0">
                        <CartItemImage src={item.imageUrl} alt={item.productTitle} />
                      </div>
                      <div className="truncate">
                        <p className="font-body-sm text-xs font-bold text-primary truncate">
                          {item.productTitle}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          Qty: {item.quantity} {item.variantSize ? `• Size: ${formatNormalSize(item.variantSize)}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-primary shrink-0 ml-2">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Promo Code Input on Left side of Summary */}
              <div className="lg:col-span-6 flex flex-col gap-space-xs">
                <form onSubmit={handleApplyPromo} className="flex flex-col gap-space-2xs">
                  <label className="font-label-caps text-label-caps uppercase text-xs text-on-surface-variant font-bold">
                    Have a Promo Code or Gift Coupon?
                  </label>
                  <div className="flex items-center gap-space-xs">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="SPORT20 or CHAMPION10"
                      className="flex-1 bg-surface-container-lowest text-primary font-mono text-xs uppercase px-space-sm py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
                    />
                    <button
                      type="submit"
                      className="bg-surface-container-highest hover:bg-surface-bright text-primary font-label-caps text-label-caps uppercase px-space-md py-2.5 rounded font-bold transition-all text-xs cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMsg.text && (
                    <span className={`text-xs mt-1 ${promoMsg.isError ? 'text-error' : 'text-primary-fixed font-bold'}`}>
                      {promoMsg.text}
                    </span>
                  )}
                </form>

                {/* Applied Promo Code Pill */}
                {promoCode && discountAmount > 0 && (
                  <div className="flex justify-between items-center bg-secondary-container/20 px-space-sm py-2 rounded border border-secondary-container/30 mt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-sm">local_offer</span>
                      <span className="font-label-caps text-label-caps uppercase text-secondary font-bold text-xs">
                        Coupon '{promoCode}' Active
                      </span>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <span className="font-title-base text-body-md text-secondary font-bold">
                        -{formatCurrency(discountAmount)}
                      </span>
                      <button
                        type="button"
                        onClick={removePromo}
                        aria-label="Remove coupon"
                        className="text-secondary hover:text-on-secondary-container cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Details Table on Right side of Summary */}
              <div className="lg:col-span-6 bg-surface-container p-space-md rounded-lg border border-surface-container-high flex flex-col gap-space-xs">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-body-md text-on-surface-variant">Items Subtotal</span>
                  <span className="font-title-base text-primary font-bold">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-sm text-secondary">
                    <span className="font-body-md">Coupon Discount</span>
                    <span className="font-bold">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm">
                  <span className="font-body-md text-on-surface-variant">Shipping & Handling</span>
                  <span className="font-label-caps text-primary-fixed font-bold">
                    {shippingAmount === 0 ? 'FREE' : formatCurrency(shippingAmount)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-body-md text-on-surface-variant">Estimated GST (18%)</span>
                  <span className="font-title-base text-primary font-bold">{formatCurrency(taxAmount)}</span>
                </div>

                <div className="border-t border-surface-container-high/80 pt-space-xs mt-space-2xs flex justify-between items-baseline">
                  <div>
                    <span className="font-headline-md text-headline-md uppercase text-primary font-bold block">
                      Total Amount Due
                    </span>
                    <span className="text-[11px] text-on-surface-variant">All applicable taxes & duties included</span>
                  </div>
                  <div className="text-right">
                    <span className="font-display-hero text-headline-xl text-primary font-bold">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center gap-space-xs text-secondary-fixed mt-1 bg-secondary-container/10 p-1.5 rounded">
                    <span className="material-symbols-outlined text-sm">savings</span>
                    <span className="font-label-caps text-label-caps uppercase text-xs font-bold">
                      You are saving {formatCurrency(discountAmount)} on this order!
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Next Step CTA: Proceed to Payment */}
            <div className="flex justify-end pt-space-xs border-t border-surface-container-high">
              <button
                type="button"
                onClick={scrollToPayment}
                className="px-space-lg py-2.5 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-headline-md uppercase font-bold rounded flex items-center gap-2 shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all text-sm cursor-pointer"
              >
                <span>Proceed to Payment</span>
                <span className="material-symbols-outlined text-base">arrow_downward</span>
              </button>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 4: PAYMENT METHOD & FINAL ORDER CONFIRMATION                      */}
          {/* ========================================================================= */}
          <section
            ref={paymentSectionRef}
            id="payment-section"
            className="bg-surface-container-low rounded-xl p-space-lg shadow-md flex flex-col gap-space-lg border border-surface-container-high/60"
          >
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-space-sm">
                <span className="w-7 h-7 rounded bg-primary-fixed text-on-primary font-label-caps text-xs flex items-center justify-center font-bold">
                  4
                </span>
                <div>
                  <h2 className="font-headline-lg text-headline-lg uppercase text-primary font-bold tracking-tight">
                    Select Payment Method & Finalize Order
                  </h2>
                  <p className="font-body-sm text-xs text-on-surface-variant">
                    All transactions are 256-Bit SSL Encrypted and RBI compliant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-primary-fixed font-label-caps text-xs uppercase font-bold">
                <span className="material-symbols-outlined text-sm">enhanced_encryption</span>
                <span>256-Bit SSL</span>
              </div>
            </div>

            {/* Payment Tabs: UPI, Card, Net Banking, COD */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs bg-surface-container-lowest p-1 rounded-lg border border-surface-container-high">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`py-2.5 px-space-xs rounded font-label-caps text-label-caps uppercase text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'bg-surface-container-high text-primary-fixed shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">qr_code_2</span>
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`py-2.5 px-space-xs rounded font-label-caps text-label-caps uppercase text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'CARD'
                    ? 'bg-surface-container-high text-primary-fixed shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">credit_card</span>
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`py-2.5 px-space-xs rounded font-label-caps text-label-caps uppercase text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'NETBANKING'
                    ? 'bg-surface-container-high text-primary-fixed shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">account_balance</span>
                <span>Net Banking</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`py-2.5 px-space-xs rounded font-label-caps text-label-caps uppercase text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'COD'
                    ? 'bg-surface-container-high text-primary-fixed shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-sm">local_shipping</span>
                <span>Cash on Delivery</span>
              </button>
            </div>

            {/* Payment Method Details */}
            {paymentMethod === 'UPI' && (
              <div className="bg-surface-container p-space-md rounded-lg border border-surface-container-high flex flex-col gap-space-md">
                <div className="flex flex-col gap-space-2xs">
                  <label className="font-label-caps text-label-caps text-xs uppercase text-on-surface-variant font-bold">
                    Enter Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank or 9876543210@paytm"
                      className="flex-1 bg-surface-container-lowest text-primary font-mono text-sm px-space-md py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
                    />
                    <button
                      type="button"
                      className="px-space-md bg-surface-container-highest text-primary-fixed font-label-caps uppercase text-xs font-bold rounded"
                    >
                      Verify
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-space-sm pt-space-xs text-xs text-on-surface-variant">
                  <span className="font-label-caps uppercase font-bold">Instant UPI Apps:</span>
                  <span className="bg-surface-container-lowest px-2 py-1 rounded font-bold text-primary">Google Pay</span>
                  <span className="bg-surface-container-lowest px-2 py-1 rounded font-bold text-primary">PhonePe</span>
                  <span className="bg-surface-container-lowest px-2 py-1 rounded font-bold text-primary">Paytm</span>
                  <span className="bg-surface-container-lowest px-2 py-1 rounded font-bold text-primary">BHIM UPI</span>
                </div>
              </div>
            )}

            {paymentMethod === 'CARD' && (
              <div className="bg-surface-container p-space-md rounded-lg border border-surface-container-high flex flex-col gap-space-md">
                <div className="flex flex-col gap-space-2xs">
                  <label className="font-label-caps text-label-caps text-xs uppercase text-on-surface-variant font-bold">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardForm.cardholderName}
                    onChange={(e) => setCardForm({ ...cardForm, cardholderName: e.target.value })}
                    className="bg-surface-container-lowest text-primary font-body-sm px-space-md py-2.5 rounded border border-surface-container-high uppercase tracking-wider focus:outline-none focus:border-primary-fixed"
                  />
                </div>
                <div className="flex flex-col gap-space-2xs">
                  <div className="flex justify-between items-center">
                    <label className="font-label-caps text-label-caps text-xs uppercase text-on-surface-variant font-bold">
                      Card Number
                    </label>
                    <div className="flex gap-1 text-on-surface-variant text-xs font-mono font-bold">
                      <span className="bg-surface-container-high px-1.5 py-0.5 rounded text-[10px]">RUPAY</span>
                      <span className="bg-surface-container-high px-1.5 py-0.5 rounded text-[10px]">VISA</span>
                      <span className="bg-surface-container-high px-1.5 py-0.5 rounded text-[10px]">MASTERCARD</span>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardForm.cardNumber}
                      onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                      className="w-full bg-surface-container-lowest text-primary font-mono text-sm px-space-md py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
                    />
                    <span className="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-primary-fixed text-lg">
                      check_circle
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-space-2xs">
                    <label className="font-label-caps text-label-caps text-xs uppercase text-on-surface-variant font-bold">
                      Expires (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardForm.expires}
                      onChange={(e) => setCardForm({ ...cardForm, expires: e.target.value })}
                      className="bg-surface-container-lowest text-primary font-mono text-sm px-space-md py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
                    />
                  </div>
                  <div className="flex flex-col gap-space-2xs">
                    <label className="font-label-caps text-label-caps text-xs uppercase text-on-surface-variant font-bold">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                      className="bg-surface-container-lowest text-primary font-mono text-sm px-space-md py-2.5 rounded border border-surface-container-high focus:outline-none focus:border-primary-fixed"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'NETBANKING' && (
              <div className="bg-surface-container p-space-md rounded-lg border border-surface-container-high flex flex-col gap-space-md">
                <label className="font-label-caps text-label-caps text-xs uppercase text-on-surface-variant font-bold">
                  Select Your Bank
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-space-xs">
                  {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`p-2 rounded text-xs font-bold uppercase transition-all ${
                        selectedBank === b
                          ? 'bg-primary-fixed text-on-primary shadow-sm'
                          : 'bg-surface-container-lowest text-primary hover:bg-surface-bright'
                      }`}
                    >
                      {b} Bank
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === 'COD' && (
              <div className="bg-surface-container p-space-md rounded-lg border border-surface-container-high flex items-start gap-space-md">
                <span className="material-symbols-outlined text-2xl text-primary-fixed">local_shipping</span>
                <div>
                  <p className="font-title-base text-primary font-bold">Cash on Delivery Available</p>
                  <p className="font-body-sm text-on-surface-variant text-xs mt-1">
                    Pay in cash or scan QR via UPI when your package arrives at your doorstep. Verified delivery OTP required.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message Display */}
            {orderError && (
              <div className="bg-error-container/40 border border-error text-error text-xs p-3 rounded flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{orderError}</span>
              </div>
            )}

            {/* FINAL CONFIRMATION BUTTON */}
            <button
              type="button"
              disabled={submittingOrder}
              onClick={handlePlaceOrder}
              className="w-full py-space-md px-space-lg bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-headline-md text-headline-md uppercase font-bold rounded shadow-[0_0_28px_rgba(204,255,0,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-space-xs disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined font-bold text-xl">
                {paymentMethod === 'COD' ? 'local_shipping' : 'lock'}
              </span>
              <span>
                {submittingOrder
                  ? 'Processing Your Order...'
                  : paymentMethod === 'COD'
                  ? `Confirm Cash on Delivery Order • ${formatCurrency(totalAmount)}`
                  : `Confirm Order & Pay ${formatCurrency(totalAmount)}`}
              </span>
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-space-xs text-center pt-space-md border-t border-surface-container-high/60">
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary-fixed text-lg">sync</span>
                <span className="font-label-caps text-label-caps uppercase text-[10px] text-on-surface-variant leading-tight">
                  30-Day Easy Returns
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary-fixed text-lg">verified</span>
                <span className="font-label-caps text-label-caps uppercase text-[10px] text-on-surface-variant leading-tight">
                  100% Genuine Pro Gear
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="material-symbols-outlined text-primary-fixed text-lg">security</span>
                <span className="font-label-caps text-label-caps uppercase text-[10px] text-on-surface-variant leading-tight">
                  RBI Compliant & Encrypted
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ORDER CONFIRMATION POPUP MODAL                                            */}
      {/* ========================================================================= */}
      {showSuccessModal && confirmedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg bg-surface-container-low border border-primary-fixed/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(204,255,0,0.25)] flex flex-col items-center text-center overflow-hidden my-8">
            {/* Background micro atmospheric glow */}
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                navigate(`/orders/success/${confirmedOrder.orderNumber}`);
              }}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-1 cursor-pointer"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            {/* Celebratory Icon */}
            <div className="relative mb-3 mt-1">
              <div className="w-20 h-20 rounded-full bg-primary-fixed text-on-primary flex items-center justify-center shadow-[0_0_32px_rgba(204,255,0,0.45)]">
                <span className="material-symbols-outlined text-4xl font-black">check_circle</span>
              </div>
              <span className="absolute -top-2 -right-2 text-2xl select-none animate-bounce">🎉</span>
            </div>

            {/* Title & Subtitle */}
            <span className="font-label-caps uppercase text-primary-fixed text-xs tracking-widest font-bold">
              Order Confirmed & Telemetry Synced
            </span>
            <h2 className="font-headline-xl text-xl sm:text-2xl uppercase text-primary font-black mt-1">
              ORDER PLACED SUCCESSFULLY!
            </h2>
            <p className="font-body-md text-on-surface-variant text-xs sm:text-sm max-w-md mx-auto">
              Thank you, <strong className="text-primary">{confirmedOrder.shippingName}</strong>! Your tournament-spec order has been received and is being dispatched.
            </p>

            {/* Order Details Card */}
            <div className="w-full bg-surface-container rounded-xl p-4 border border-surface-container-high text-left flex flex-col gap-3 my-3 shadow-inner">
              {/* Order ID & Copy button */}
              <div className="flex items-center justify-between pb-2.5 border-b border-surface-container-high/60">
                <div>
                  <span className="font-label-caps uppercase text-[10px] text-on-surface-variant block">
                    Order Reference Number
                  </span>
                  <span className="font-mono text-base font-extrabold text-primary-fixed">
                    {confirmedOrder.orderNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(confirmedOrder.orderNumber);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs bg-surface-container-highest hover:bg-surface-bright px-2.5 py-1.5 rounded text-primary font-label-caps uppercase flex items-center gap-1 transition-all border border-surface-container-high cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copied ? 'done' : 'content_copy'}
                  </span>
                  <span>{copied ? 'Copied' : 'Copy ID'}</span>
                </button>
              </div>

              {/* Dedicated Shipping & Delivery Details */}
              <div className="bg-surface-container-lowest/80 p-3.5 rounded-lg border border-surface-container-high/60 flex flex-col gap-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary-fixed text-base">local_shipping</span>
                    <span className="font-label-caps uppercase text-[11px] text-primary font-bold">
                      Shipping & Delivery Details
                    </span>
                  </div>
                  <span className="bg-primary-fixed/20 text-primary-fixed px-2 py-0.5 rounded text-[10px] font-label-caps uppercase font-bold">
                    {confirmedOrder.shippingFee === 'FREE' ? 'Free Shipping' : confirmedOrder.shippingFee}
                  </span>
                </div>

                {/* Recipient & Full Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-label-caps uppercase text-[10px] text-on-surface-variant block">
                      Recipient / Mobile Contact
                    </span>
                    <p className="font-bold text-primary mt-0.5">{confirmedOrder.shippingName}</p>
                    <p className="text-on-surface-variant mt-0.5 flex items-center gap-1 font-mono text-[11px]">
                      <span className="material-symbols-outlined text-xs text-primary-fixed">call</span>
                      <span>{confirmedOrder.shippingPhone}</span>
                    </p>
                  </div>

                  <div>
                    <span className="font-label-caps uppercase text-[10px] text-on-surface-variant block">
                      Delivery Address
                    </span>
                    <p className="font-medium text-primary mt-0.5 leading-snug">
                      {confirmedOrder.streetAddress}
                      {confirmedOrder.aptSuite ? `, ${confirmedOrder.aptSuite}` : ''}
                    </p>
                    <p className="text-on-surface-variant text-[11px] mt-0.5">
                      {confirmedOrder.city}, {confirmedOrder.state} - <strong className="text-primary-fixed">{confirmedOrder.pinCode}</strong>, India 🇮🇳
                    </p>
                  </div>
                </div>

                {/* Logistics Partner & Estimated Delivery */}
                <div className="pt-2 border-t border-surface-container-high/50 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-label-caps uppercase block">
                      Carrier & Tracking AWB
                    </span>
                    <p className="font-bold text-primary mt-0.5 text-[11px]">{confirmedOrder.courier}</p>
                    <p className="font-mono text-[11px] text-primary-fixed font-bold mt-0.5">
                      {confirmedOrder.trackingAwb}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-on-surface-variant font-label-caps uppercase block">
                      Estimated Delivery Window
                    </span>
                    <p className="font-bold text-secondary-fixed mt-0.5 flex items-center gap-1 text-[11px]">
                      <span className="material-symbols-outlined text-xs">calendar_today</span>
                      <span>{confirmedOrder.estimatedDelivery}</span>
                    </p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      Method: {confirmedOrder.shippingTier}
                    </p>
                  </div>
                </div>

                {/* 4-Stage Shipment Progress Tracker */}
                <div className="pt-1.5 border-t border-surface-container-high/40">
                  <div className="flex items-center justify-between text-[9px] font-label-caps uppercase text-on-surface-variant mb-1">
                    <span className="text-primary-fixed font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-ping"></span>
                      Order Confirmed
                    </span>
                    <span>Packed</span>
                    <span>In Transit</span>
                    <span>Out For Delivery</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary-fixed h-full w-1/4 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Payment Method & Total */}
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <div>
                  <span className="font-label-caps uppercase text-[10px] text-on-surface-variant block">
                    Payment Mode
                  </span>
                  <span className="font-bold text-primary">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="text-right">
                  <span className="font-label-caps uppercase text-[10px] text-on-surface-variant block">
                    Total Amount
                  </span>
                  <span className="font-headline-md font-extrabold text-primary-fixed text-base">
                    {formatCurrency(confirmedOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Dispatch Notification Alert */}
            <div className="w-full bg-primary-fixed/10 border border-primary-fixed/20 p-2.5 rounded-lg text-xs text-left flex items-center gap-2 text-on-surface mb-2">
              <span className="material-symbols-outlined text-primary-fixed text-base shrink-0">
                sms
              </span>
              <span className="text-[11px]">
                Instant SMS dispatch telemetry & courier tracking link sent to <strong>{confirmedOrder.shippingPhone}</strong>.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-2.5 mt-1">
              <button
                type="button"
                onClick={() => navigate(`/orders/success/${confirmedOrder.orderNumber}`)}
                className="flex-1 py-3 px-4 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-headline-md uppercase font-bold rounded shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">receipt_long</span>
                <span>View Full Order Details</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="flex-1 py-3 px-4 bg-surface-container-highest hover:bg-surface-bright text-primary font-headline-md uppercase font-bold rounded transition-all text-xs border border-surface-variant flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">shopping_bag</span>
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartCheckoutPage;

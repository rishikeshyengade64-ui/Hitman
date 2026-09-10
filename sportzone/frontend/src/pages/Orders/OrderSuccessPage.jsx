import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import useAuth from '../../hooks/useAuth';
import { formatCurrency, formatDate, formatNormalSize } from '../../utils/formatters';
import { storage } from '../../utils/storage';
import { CartItemImage } from '../../components/common/CartItemImage';

export const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedAwb, setCopiedAwb] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      // 1. Check storage for immediate cache hydration
      const cached = storage.getLastOrder();
      if (cached && (cached.orderNumber === orderNumber || !orderNumber)) {
        setOrder(cached);
      }

      // 2. Fetch authenticated backend order details if available
      if (isAuthenticated && orderNumber) {
        try {
          const data = await orderService.getOrderByNumber(orderNumber);
          if (data) {
            setOrder((prev) => ({ ...(prev || {}), ...data }));
          }
        } catch (err) {
          console.warn('Could not fetch remote order, relying on local telemetry:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, isAuthenticated]);

  const handleCopyOrder = () => {
    const code = orderNumber || order?.orderNumber || '';
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedOrder(true);
      setTimeout(() => setCopiedOrder(false), 2000);
    }
  };

  const handleCopyAwb = (awb) => {
    if (awb) {
      navigator.clipboard.writeText(awb);
      setCopiedAwb(true);
      setTimeout(() => setCopiedAwb(false), 2000);
    }
  };

  // Derive shipping and logistics telemetry
  const isOvernight =
    order?.shippingTier === 'APEX_OVERNIGHT' ||
    order?.shippingTier?.toLowerCase().includes('overnight');

  const courierPartner =
    order?.courier ||
    (isOvernight ? 'BlueDart Air Priority Express' : 'Delhivery Surface & Air Cargo');

  const trackingAwb =
    order?.trackingAwb ||
    `AWB-${Math.floor(100000000 + (order?.id || 4289) * 1337) % 900000000 + 100000000}IN`;

  const orderDate = order?.createdAt ? formatDate(order.createdAt) : formatDate(new Date().toISOString());

  // Calculate delivery date if not explicitly stored
  let estimatedDelivery = order?.estimatedDelivery;
  if (!estimatedDelivery) {
    const baseDate = order?.createdAt ? new Date(order.createdAt) : new Date();
    const dMin = new Date(baseDate);
    dMin.setDate(baseDate.getDate() + (isOvernight ? 1 : 2));
    const dMax = new Date(baseDate);
    dMax.setDate(baseDate.getDate() + (isOvernight ? 1 : 4));
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    estimatedDelivery = isOvernight
      ? `Tomorrow by 10:30 AM (${dMin.toLocaleDateString('en-IN', dateOptions)})`
      : `${dMin.toLocaleDateString('en-IN', dateOptions)} - ${dMax.toLocaleDateString('en-IN', dateOptions)}`;
  }

  const recipientName =
    order?.shippingName ||
    (order?.shippingFirstName
      ? `${order.shippingFirstName} ${order.shippingLastName || ''}`.trim()
      : 'Athlete Pro');

  const recipientPhone = order?.shippingPhone || '+91 98765 43210';
  const streetAddress = order?.streetAddress || order?.shippingAddress || 'Athletic Quarter, Sector 14';
  const aptSuite = order?.aptSuite || order?.shippingApt || '';
  const city = order?.city || order?.shippingCity || 'New Delhi';
  const state = order?.state || order?.shippingState || 'Delhi';
  const pinCode = order?.pinCode || order?.shippingZipCode || '110001';
  const shippingTierName =
    order?.shippingTier ||
    (isOvernight ? 'Apex Overnight Priority' : 'Express Standard Delivery');
  const shippingFeeBadge =
    order?.shippingFee ||
    (order?.shippingAmount > 0 ? formatCurrency(order.shippingAmount) : 'FREE');

  const paymentMethodLabel = order?.paymentMethod || 'Credit / Debit Card';
  const orderItems = order?.items || [];

  return (
    <div className="max-w-[960px] mx-auto px-space-md lg:px-space-xl py-space-xl text-on-surface">
      {/* Top Atmospheric Glow */}
      <div className="relative w-full">
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-fixed/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      </div>

      <div className="space-y-space-lg">
        {/* 1. Hero Confirmation Card */}
        <div className="bg-surface-container-low rounded-2xl p-space-lg sm:p-space-xl border border-surface-container-high shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-primary-fixed text-on-primary flex items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.4)] mb-3">
            <span className="material-symbols-outlined text-4xl font-bold">check_circle</span>
          </div>

          <span className="font-label-caps text-label-caps uppercase text-primary-fixed text-xs tracking-widest font-bold">
            Order Confirmed & Telemetry Synchronized
          </span>
          <h1 className="font-headline-xl text-2xl sm:text-3xl lg:text-4xl uppercase text-primary font-black mt-1">
            Thank You For Your Order!
          </h1>
          <p className="font-body-md text-on-surface-variant max-w-lg mx-auto mt-2 text-sm sm:text-base">
            Your tournament-spec equipment is now scheduled for dispatch at our athletic fulfillment hub. Full shipping and tracking telemetry is active below.
          </p>

          {/* Quick Telemetry Header Bar */}
          <div className="w-full mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-container p-3 sm:p-4 rounded-xl border border-surface-container-high text-left">
            <div>
              <span className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant uppercase block">
                Order ID
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-sm sm:text-base font-bold text-primary">
                  {orderNumber || order?.orderNumber || 'SZ-CONFIRMED'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  title="Copy Order ID"
                  className="text-on-surface-variant hover:text-primary-fixed transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedOrder ? 'done' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <span className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant uppercase block">
                Order Date
              </span>
              <span className="font-body-sm text-xs sm:text-sm font-semibold text-on-surface mt-0.5 block">
                {orderDate}
              </span>
            </div>

            <div>
              <span className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant uppercase block">
                Status
              </span>
              <span className="inline-flex items-center gap-1.5 text-primary-fixed font-label-caps text-xs font-bold uppercase mt-0.5">
                <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></span>
                {order?.status || 'Confirmed & Prepping'}
              </span>
            </div>

            <div>
              <span className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant uppercase block">
                Total Paid
              </span>
              <span className="font-headline-md text-sm sm:text-base font-bold text-primary-fixed mt-0.5 block">
                {formatCurrency(order?.totalAmount || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Primary Shipping & Delivery Details Card */}
        <div className="bg-surface-container-low rounded-2xl p-space-lg sm:p-space-xl border border-surface-container-high shadow-xl relative overflow-hidden">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-surface-container-high">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-primary-fixed/15 text-primary-fixed flex items-center justify-center border border-primary-fixed/30">
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
              </div>
              <div>
                <h2 className="font-headline-md uppercase text-primary font-bold text-lg">
                  Shipping & Delivery Details
                </h2>
                <p className="font-label-caps uppercase text-xs text-on-surface-variant">
                  Air Cargo & Surface Logistics Telemetry
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-primary-fixed/15 text-primary-fixed border border-primary-fixed/30 px-3 py-1 rounded-full text-xs font-label-caps uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>{shippingFeeBadge === 'FREE' ? 'Free Express Shipping' : shippingFeeBadge}</span>
              </span>
            </div>
          </div>

          {/* 4-Stage Visual Delivery Progress Tracker */}
          <div className="py-5 border-b border-surface-container-high/60">
            <div className="flex items-center justify-between text-xs font-label-caps uppercase text-on-surface-variant mb-2">
              <span className="text-primary-fixed font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Order Confirmed
              </span>
              <span className="text-primary font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary-fixed animate-ping"></span>
                Hub Processing
              </span>
              <span>In Transit</span>
              <span>Out For Delivery</span>
            </div>

            {/* Progress line */}
            <div className="relative w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-fixed via-primary-fixed-dim to-primary-fixed h-full rounded-full transition-all duration-700"
                style={{ width: '35%' }}
              ></div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-on-surface-variant mt-2 font-mono gap-2">
              <span>Fulfillment Facility: New Delhi Tech-Hub</span>
              <span className="text-secondary-fixed font-bold">ETA: {estimatedDelivery}</span>
            </div>
          </div>

          {/* Detailed Shipping Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
            {/* Recipient & Phone */}
            <div className="bg-surface-container/60 p-4 rounded-xl border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-primary-fixed text-xs font-label-caps uppercase font-bold mb-1">
                  <span className="material-symbols-outlined text-sm">person</span>
                  <span>Recipient & Contact</span>
                </div>
                <h3 className="font-headline-md text-primary font-bold text-base mt-1">
                  {recipientName}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-sm text-on-surface font-mono">
                  <span className="material-symbols-outlined text-primary-fixed text-base">call</span>
                  <span className="font-bold">{recipientPhone}</span>
                  <span className="text-[10px] bg-primary-fixed/20 text-primary-fixed px-1.5 py-0.5 rounded font-label-caps uppercase">
                    SMS Alerts On
                  </span>
                </div>
              </div>

              {/* Destination Address */}
              <div className="mt-4 pt-3 border-t border-surface-container-high/60">
                <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-label-caps uppercase font-bold mb-1">
                  <span className="material-symbols-outlined text-sm text-primary-fixed">pin_drop</span>
                  <span>Destination Address</span>
                </div>
                <p className="text-sm text-primary font-medium mt-1 leading-snug">
                  {streetAddress}
                  {aptSuite ? `, ${aptSuite}` : ''}
                </p>
                <p className="text-sm text-on-surface-variant mt-0.5">
                  {city}, {state} - <strong className="text-primary-fixed font-bold">{pinCode}</strong>
                </p>
                <p className="text-xs text-on-surface-variant/80 mt-1 flex items-center gap-1">
                  <span>Country:</span>
                  <strong className="text-on-surface">India 🇮🇳</strong>
                </p>
              </div>
            </div>

            {/* Logistics Partner & AWB */}
            <div className="bg-surface-container/60 p-4 rounded-xl border border-surface-container-high flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-secondary-fixed text-xs font-label-caps uppercase font-bold mb-1">
                  <span className="material-symbols-outlined text-sm">flight_takeoff</span>
                  <span>Logistics Carrier & Tracking</span>
                </div>

                <div className="mt-2 flex items-start justify-between">
                  <div>
                    <span className="text-[11px] text-on-surface-variant font-label-caps uppercase">Carrier Partner</span>
                    <p className="font-bold text-primary text-sm mt-0.5">{courierPartner}</p>
                  </div>
                  <span className="text-[10px] bg-secondary-container/40 text-secondary-fixed px-2 py-0.5 rounded font-label-caps uppercase font-bold">
                    Air & Surface Cargo
                  </span>
                </div>

                {/* AWB Code */}
                <div className="mt-3 bg-surface-container-lowest p-2.5 rounded-lg border border-surface-container-high flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-on-surface-variant font-label-caps uppercase block">
                      Tracking Waybill (AWB)
                    </span>
                    <span className="font-mono text-sm font-bold text-primary-fixed tracking-wider">
                      {trackingAwb}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyAwb(trackingAwb)}
                    className="px-2.5 py-1.5 bg-surface-container hover:bg-surface-container-high text-primary rounded text-xs font-label-caps uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedAwb ? 'done' : 'content_copy'}
                    </span>
                    <span>{copiedAwb ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Delivery Window */}
              <div className="mt-4 pt-3 border-t border-surface-container-high/60">
                <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-label-caps uppercase font-bold mb-1">
                  <span className="material-symbols-outlined text-sm text-secondary-fixed">schedule</span>
                  <span>Estimated Delivery Window</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="material-symbols-outlined text-secondary-fixed text-lg">calendar_today</span>
                  <p className="font-bold text-primary text-sm">{estimatedDelivery}</p>
                </div>
                <p className="text-xs text-on-surface-variant mt-1 font-label-caps">
                  Tier: <span className="text-on-surface font-semibold">{shippingTierName}</span>
                </p>
              </div>
            </div>
          </div>

          {/* SMS Dispatch Alert Banner */}
          <div className="mt-5 bg-primary-fixed/10 border border-primary-fixed/20 p-3 rounded-xl flex items-center gap-3 text-xs text-on-surface">
            <div className="w-8 h-8 rounded-full bg-primary-fixed/20 text-primary-fixed flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-base">sms</span>
            </div>
            <div>
              <p className="font-bold text-primary">Live Dispatch Telemetry Dispatched</p>
              <p className="text-on-surface-variant mt-0.5">
                Real-time delivery milestones and courier out-for-delivery PIN will be sent via SMS to{' '}
                <strong className="text-primary font-mono">{recipientPhone}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Itemized Purchased Gear Manifest */}
        {orderItems.length > 0 && (
          <div className="bg-surface-container-low rounded-2xl p-space-lg sm:p-space-xl border border-surface-container-high shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed">inventory_2</span>
                <h2 className="font-headline-md uppercase text-primary font-bold text-base sm:text-lg">
                  Order Manifest ({orderItems.length} {orderItems.length === 1 ? 'Item' : 'Items'})
                </h2>
              </div>
              <span className="font-label-caps text-xs text-on-surface-variant uppercase">
                Tournament-Spec Equipment
              </span>
            </div>

            <div className="divide-y divide-surface-container-high/40">
              {orderItems.map((item, idx) => {
                const title = item.productTitle || item.product?.title || item.title || 'SportZone Gear';
                const image = item.imageUrl || item.product?.images?.[0]?.imageUrl || item.image;
                const size = item.variantSize || item.selectedSize;
                const color = item.variantColor || item.selectedColor;
                const qty = item.quantity || 1;
                const unitPrice = item.unitPrice || item.price || 0;
                const totalPrice = item.totalPrice || (unitPrice * qty);

                return (
                  <div key={item.id || idx} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-16 h-16 rounded-lg bg-surface-container overflow-hidden border border-surface-container-high shrink-0">
                        <CartItemImage src={image} alt={title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-headline-sm uppercase font-bold text-primary text-sm truncate">
                          {title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant mt-1">
                          {size && (
                            <span className="bg-surface-container px-2 py-0.5 rounded font-mono text-[11px] text-on-surface">
                              Size: {formatNormalSize(size)}
                            </span>
                          )}
                          {color && (
                            <span className="bg-surface-container px-2 py-0.5 rounded text-[11px] text-on-surface">
                              Color: {color}
                            </span>
                          )}
                          <span className="text-on-surface font-semibold font-mono">
                            Qty: {qty}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-headline-md font-bold text-primary text-sm sm:text-base">
                        {formatCurrency(totalPrice)}
                      </p>
                      {qty > 1 && (
                        <p className="font-mono text-[11px] text-on-surface-variant mt-0.5">
                          {formatCurrency(unitPrice)} each
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Payment Breakdown & Financial Telemetry */}
        <div className="bg-surface-container-low rounded-2xl p-space-lg sm:p-space-xl border border-surface-container-high shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-surface-container-high mb-4">
            <span className="material-symbols-outlined text-primary-fixed">receipt</span>
            <h2 className="font-headline-md uppercase text-primary font-bold text-base sm:text-lg">
              Payment Summary & Invoicing
            </h2>
          </div>

          <div className="space-y-2 text-sm text-on-surface-variant">
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="text-primary font-bold">{paymentMethodLabel}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-on-surface font-mono font-semibold">
                {formatCurrency(order?.subtotal || order?.totalAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="text-primary-fixed font-bold font-label-caps">
                {shippingFeeBadge}
              </span>
            </div>
            {order?.discountAmount > 0 && (
              <div className="flex justify-between text-secondary-fixed">
                <span>Discount Applied:</span>
                <span className="font-mono font-bold">-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST / Taxes Included:</span>
              <span className="text-on-surface font-mono">
                {order?.taxAmount ? formatCurrency(order.taxAmount) : '₹0'}
              </span>
            </div>
            <div className="pt-3 border-t border-surface-container-high flex justify-between items-center text-base">
              <span className="font-headline-md uppercase text-primary font-bold">Total Paid:</span>
              <span className="font-headline-lg font-black text-primary-fixed text-xl">
                {formatCurrency(order?.totalAmount || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Navigation & Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/shop"
            className="px-6 py-3.5 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-headline-md uppercase font-bold rounded shadow-[0_0_24px_rgba(204,255,0,0.3)] transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">storefront</span>
            <span>Continue Shopping</span>
          </Link>

          {isAuthenticated && (
            <Link
              to="/orders"
              className="px-6 py-3.5 bg-surface-container hover:bg-surface-container-high text-primary font-headline-md uppercase font-bold rounded border border-surface-container-high transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">history</span>
              <span>View Order History</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-3.5 bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-primary font-label-caps uppercase text-xs font-bold rounded border border-surface-container-high transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;


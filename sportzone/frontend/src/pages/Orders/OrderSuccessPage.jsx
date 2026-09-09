import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import useAuth from '../../hooks/useAuth';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const OrderSuccessPage = () => {
  const { orderNumber } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (isAuthenticated && orderNumber) {
        try {
          const data = await orderService.getOrderByNumber(orderNumber);
          setOrder(data);
        } catch (err) {
          console.error('Error fetching order details:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, isAuthenticated]);

  return (
    <div className="max-w-[800px] mx-auto px-space-md py-space-3xl">
      <div className="bg-surface-container-low rounded-2xl p-space-xl border border-surface-container-high shadow-2xl text-center flex flex-col items-center gap-space-md relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-primary-fixed/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-primary-fixed text-on-primary flex items-center justify-center shadow-[0_0_24px_rgba(204,255,0,0.4)]">
          <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
        </div>

        <div>
          <span className="font-label-caps text-label-caps uppercase text-primary-fixed text-xs tracking-widest font-bold">
            Order Confirmed & Telemetry Synced
          </span>
          <h1 className="font-headline-xl text-headline-xl uppercase text-primary font-black mt-1">
            THANK YOU FOR YOUR ORDER!
          </h1>
          <p className="font-body-md text-on-surface-variant max-w-md mx-auto mt-2">
            Your tournament-spec equipment is now being prepped at our athletic fulfillment facility.
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="w-full bg-surface-container rounded-xl p-space-md border border-surface-container-high text-left flex flex-col gap-space-sm my-space-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-container-high/60 pb-space-xs">
            <div>
              <span className="font-label-caps text-xs text-on-surface-variant uppercase">Order Number</span>
              <p className="font-mono text-base font-bold text-primary">{orderNumber}</p>
            </div>
            <div className="text-right">
              <span className="font-label-caps text-xs text-on-surface-variant uppercase">Status</span>
              <p className="font-label-caps text-xs font-bold text-primary-fixed uppercase">
                {order?.status || 'Confirmed & Processing'}
              </p>
            </div>
          </div>

          {order && (
            <>
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Ordered Date:</span>
                <span className="text-on-surface font-semibold">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Shipping Tier:</span>
                <span className="text-on-surface font-semibold">{order.shippingTier}</span>
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Total Paid:</span>
                <span className="text-primary-fixed font-bold font-headline-md text-lg">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-xs">
          <Link
            to="/shop"
            className="px-space-xl py-3 bg-primary-fixed hover:bg-primary-fixed-dim text-on-primary font-headline-md text-headline-md uppercase font-bold rounded shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all"
          >
            Continue Shopping
          </Link>
          {isAuthenticated && (
            <Link
              to="/orders"
              className="px-space-xl py-3 bg-surface-container hover:bg-surface-container-high text-primary font-headline-md text-headline-md uppercase font-bold rounded border border-surface-variant transition-colors"
            >
              View Order History
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;

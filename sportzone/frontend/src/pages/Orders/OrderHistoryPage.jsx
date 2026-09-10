import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { formatCurrency, formatDate, formatNormalSize } from '../../utils/formatters';

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-[1100px] mx-auto px-space-md py-space-xl">
      <div className="flex items-center justify-between pb-space-md border-b border-surface-container-high/60 mb-space-lg">
        <div>
          <span className="font-label-caps text-primary-fixed uppercase text-xs font-bold">
            Account Telemetry
          </span>
          <h1 className="font-headline-xl text-headline-xl uppercase text-primary font-bold">
            My Order History
          </h1>
        </div>
        <Link
          to="/shop"
          className="font-label-caps text-xs text-primary-fixed uppercase underline hover:text-primary"
        >
          Explore Catalog
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <span className="material-symbols-outlined text-4xl text-primary-fixed animate-spin">sync</span>
          <p className="font-label-caps uppercase text-sm text-on-surface-variant">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-surface-container-low rounded-xl p-12 text-center border border-surface-container-high">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-2">receipt_long</span>
          <h3 className="font-headline-lg text-primary uppercase font-bold">No Orders Placed Yet</h3>
          <p className="text-on-surface-variant text-sm mt-1 mb-4">
            Once you gear up and place an order, track your shipment right here.
          </p>
          <Link
            to="/shop"
            className="px-4 py-2 bg-primary-fixed text-on-primary font-label-caps uppercase rounded font-bold"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-space-md">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-surface-container rounded-xl p-space-md border border-surface-container-high shadow-md flex flex-col gap-space-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-container-high/40 pb-space-xs">
                <div>
                  <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Order Number</span>
                  <p className="font-mono text-sm font-bold text-primary">{ord.orderNumber}</p>
                </div>
                <div>
                  <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Date</span>
                  <p className="font-body-sm text-xs font-semibold text-on-surface">{formatDate(ord.createdAt)}</p>
                </div>
                <div>
                  <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Total Paid</span>
                  <p className="font-headline-md text-sm font-bold text-primary-fixed">{formatCurrency(ord.totalAmount)}</p>
                </div>
                <div>
                  <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Status</span>
                  <span className="inline-block bg-surface-container-high text-primary-fixed px-2 py-0.5 rounded text-xs font-label-caps uppercase font-bold">
                    {ord.status}
                  </span>
                </div>
              </div>

              {/* Items in order */}
              <div className="flex flex-col gap-2 pt-1">
                {ord.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="text-on-surface font-medium">
                      {item.quantity}x {item.productTitle} {item.variantSize ? `(${formatNormalSize(item.variantSize)})` : ''}
                    </span>
                    <span className="font-mono">{formatCurrency(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              {/* Shipping & Tracking Action Link */}
              <div className="pt-2 border-t border-surface-container-high/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px]">
                  <span className="material-symbols-outlined text-primary-fixed text-sm">local_shipping</span>
                  <span>
                    {ord.shippingCity ? `Delivering to ${ord.shippingCity}, ${ord.shippingZipCode || ''}` : 'Fast Express Delivery'}
                  </span>
                </div>
                <Link
                  to={`/orders/success/${ord.orderNumber}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-fixed/10 hover:bg-primary-fixed/20 text-primary-fixed font-label-caps uppercase text-[11px] font-bold rounded transition-colors"
                >
                  <span>Track Shipment & Details</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;

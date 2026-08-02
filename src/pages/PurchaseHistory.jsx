import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Eye, PackageCheck, ShoppingBag } from 'lucide-react';
import { paymentService } from '../services/paymentService';

const formatCurrency = (value) => `INR ${Number(value || 0).toLocaleString('en-IN')}`;

const formatDate = (value) => {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const downloadFile = (filename, content) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const formatCustomerAddress = (customerDetails = {}) => [
  customerDetails.address,
  customerDetails.city,
  customerDetails.state,
  customerDetails.pincode
].filter(Boolean).join(', ');

const getCustomerName = (purchase) => purchase.customerDetails?.name || purchase.buyer?.name || 'Not saved';
const getCustomerPhone = (purchase) => purchase.customerDetails?.phone || purchase.buyer?.phone || 'Not saved';
const getCustomerAddress = (purchase) => formatCustomerAddress(purchase.customerDetails) || 'Not saved';

const buildReceipt = (purchase) => [
  'AutoMart purchase receipt',
  '',
  `Product: ${purchase.product ? `${purchase.product.brand} ${purchase.product.model}` : 'Deleted product'}`,
  `Category: ${purchase.product?.parts || 'Part'}`,
  `Quantity: ${purchase.quantity || 1}`,
  `Order ID: ${purchase.orderId}`,
  `Payment ID: ${purchase.paymentId || 'Payment ID pending'}`,
  `Customer: ${getCustomerName(purchase)}`,
  `Customer phone: ${getCustomerPhone(purchase)}`,
  `Customer address: ${getCustomerAddress(purchase)}`,
  `Seller: ${purchase.seller?.name || 'Seller'}`,
  `Seller email: ${purchase.seller?.email || 'No email'}`,
  `Date: ${formatDate(purchase.purchasedAt)}`,
  `Price: ${formatCurrency(purchase.amount)}`
].join('\n');

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await paymentService.getMyPurchases();
        setPurchases(response.data || []);
      } catch (err) {
        setError(err.message || 'Unable to load purchases');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div className="cro-page flex items-center justify-center">
        <p className="text-sm font-bold text-olx-muted">Loading your purchases...</p>
      </div>
    );
  }

  return (
    <div className="cro-page">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-1 text-xs font-extrabold uppercase text-sky-800">
              <ShoppingBag className="h-4 w-4" />
              Buyer receipts
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-olx-dark sm:text-4xl">My purchases</h1>
            <p className="mt-2 max-w-2xl text-olx-muted">
              View completed orders and download receipts with order ID, payment ID, seller, date, and price.
            </p>
          </div>
          <Link
            to="/parts"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-olx-dark px-5 py-3 font-extrabold text-white shadow-cta transition hover:bg-[#0d3d42]"
          >
            <ShoppingBag className="h-5 w-5" />
            Browse parts
          </Link>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-white p-6 text-center shadow-premium">
            <p className="font-extrabold text-red-800">Purchases could not load</p>
            <p className="mt-2 text-sm text-olx-muted">{error}</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="rounded-xl border border-dashed border-olx-border bg-white p-12 text-center shadow-premium">
            <PackageCheck className="mx-auto h-10 w-10 text-olx-muted" />
            <p className="mt-4 font-extrabold text-olx-dark">No purchases yet</p>
            <p className="mt-2 text-sm text-olx-muted">Completed payments will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {purchases.map((purchase) => (
              <div key={purchase._id} className="rounded-xl border border-olx-border bg-white p-5 shadow-premium ring-1 ring-slate-900/5">
                <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <p className="text-lg font-extrabold text-olx-dark">
                      {purchase.product ? `${purchase.product.brand} ${purchase.product.model}` : 'Deleted product'}
                    </p>
                    <div className="mt-3 grid gap-2 text-sm text-olx-muted sm:grid-cols-2 lg:grid-cols-4">
                      <span><strong className="text-olx-dark">Order:</strong> {purchase.orderId}</span>
                      <span><strong className="text-olx-dark">Payment:</strong> {purchase.paymentId || 'Pending'}</span>
                      <span><strong className="text-olx-dark">Qty:</strong> {purchase.quantity || 1}</span>
                      <span><strong className="text-olx-dark">Date:</strong> {formatDate(purchase.purchasedAt)}</span>
                      <span><strong className="text-olx-dark">Price:</strong> {formatCurrency(purchase.amount)}</span>
                    </div>
                    <p className="mt-3 text-sm text-olx-muted">
                      Seller: <strong className="text-olx-dark">{purchase.seller?.name || 'Seller'}</strong>
                      {purchase.seller?.email ? ` - ${purchase.seller.email}` : ''}
                    </p>
                    <div className="mt-4 rounded-lg border border-olx-border bg-slate-50 p-3 text-sm">
                      <p className="font-extrabold text-olx-dark">Customer details</p>
                      <div className="mt-2 grid gap-2 text-olx-muted sm:grid-cols-2">
                        <span><strong className="text-olx-dark">Name:</strong> {getCustomerName(purchase)}</span>
                        <span><strong className="text-olx-dark">Phone:</strong> {getCustomerPhone(purchase)}</span>
                      </div>
                      <p className="mt-2 text-olx-muted">
                        <strong className="text-olx-dark">Address:</strong> {getCustomerAddress(purchase)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {purchase.product?._id && (
                      <Link
                        to={`/parts/${purchase.product._id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-olx-border px-3 py-2 text-sm font-bold text-olx-dark transition hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => downloadFile(`automart-purchase-${purchase.orderId}.txt`, buildReceipt(purchase))}
                      className="inline-flex items-center gap-2 rounded-lg bg-olx-sell px-3 py-2 text-sm font-extrabold text-olx-dark shadow-md transition hover:brightness-105"
                    >
                      <Download className="h-4 w-4" />
                      Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;

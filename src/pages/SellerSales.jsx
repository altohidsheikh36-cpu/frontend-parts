import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  CalendarDays,
  CheckCircle,
  Clock,
  Download,
  Eye,
  IndianRupee,
  PackageCheck,
  PackageOpen,
  Plus,
  ShoppingBag,
  TrendingUp
} from 'lucide-react';
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

const downloadFile = (filename, content, type = 'text/csv;charset=utf-8;') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const csvEscape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

const formatCustomerAddress = (customerDetails = {}) => {
  if (typeof customerDetails === 'string') return customerDetails.trim();

  return [
    customerDetails.address,
    customerDetails.city,
    customerDetails.state,
    customerDetails.pincode
  ].filter(Boolean).join(', ');
};

const getCustomerName = (order) => order.customerDetails?.name || order.buyer?.name || 'Not saved';
const getCustomerPhone = (order) => order.customerDetails?.phone || order.buyer?.phone || 'Not saved';
const getCustomerAddress = (order) => (
  formatCustomerAddress(order.customerDetails)
  || formatCustomerAddress(order.customerAddress)
  || formatCustomerAddress(order.deliveryAddress)
  || formatCustomerAddress(order.shippingAddress)
  || 'Not saved'
);

const orderToRow = (order) => [
  order.product ? `${order.product.brand} ${order.product.model}` : 'Deleted product',
  order.product?.parts || 'Part',
  order.quantity || 1,
  order.orderId,
  order.paymentId || 'Payment ID pending',
  getCustomerName(order),
  getCustomerPhone(order),
  getCustomerAddress(order),
  order.buyer?.email || '',
  formatDate(order.soldAt),
  order.amount || 0
];

const buildReceipt = (order) => [
  'AutoMart seller sale receipt',
  '',
  `Product: ${order.product ? `${order.product.brand} ${order.product.model}` : 'Deleted product'}`,
  `Category: ${order.product?.parts || 'Part'}`,
  `Quantity sold: ${order.quantity || 1}`,
  `Order ID: ${order.orderId}`,
  `Payment ID: ${order.paymentId || 'Payment ID pending'}`,
  `Buyer: ${getCustomerName(order)}`,
  `Buyer phone: ${getCustomerPhone(order)}`,
  `Buyer email: ${order.buyer?.email || 'No email'}`,
  `Buyer address: ${getCustomerAddress(order)}`,
  `Date: ${formatDate(order.soldAt)}`,
  `Price: ${formatCurrency(order.amount)}`
].join('\n');

const StatCard = ({ title, value, detail, icon, tone = 'text-olx-dark' }) => (
  <div className="rounded-xl border border-olx-border bg-white p-5 shadow-premium ring-1 ring-slate-900/5">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-olx-muted">{title}</p>
        <p className={`mt-2 text-2xl font-extrabold ${tone}`}>{value}</p>
        <p className="mt-1 text-sm text-olx-muted">{detail}</p>
      </div>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-olx-dark">
        {React.createElement(icon, { className: 'h-5 w-5', strokeWidth: 2.25 })}
      </span>
    </div>
  </div>
);

const SellerSales = () => {
  const [sales, setSales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await paymentService.getSellerSales();
        setSales(response.data);
      } catch (err) {
        setError(err.message || 'Unable to load sales details');
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const topProducts = useMemo(() => {
    const productMap = new Map();

    (sales?.orders || []).forEach((order) => {
      const product = order.product;
      const key = product?._id || order.orderId;
      const label = product ? `${product.brand} ${product.model}` : 'Deleted product';
      const current = productMap.get(key) || {
        label,
        category: product?.parts || 'Part',
        sold: 0,
        revenue: 0
      };

      current.sold += Number(order.quantity || 1);
      current.revenue += order.amount || 0;
      productMap.set(key, current);
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [sales]);

  if (loading) {
    return (
      <div className="cro-page flex items-center justify-center">
        <p className="text-sm font-bold text-olx-muted">Loading seller sales...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cro-page flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-premium">
          <p className="text-lg font-extrabold text-red-800">Sales could not load</p>
          <p className="mt-2 text-sm text-olx-muted">{error}</p>
        </div>
      </div>
    );
  }

  const summary = sales?.summary || {};
  const orders = sales?.orders || [];

  const getOrdersForPeriod = (period) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return orders.filter((order) => {
      const soldAt = new Date(order.soldAt);
      if (period === 'today') return soldAt >= startOfToday && soldAt < startOfTomorrow;
      if (period === 'week') return soldAt >= startOfWeek;
      if (period === 'month') return soldAt >= startOfMonth;
      return true;
    });
  };

  const downloadOrdersCsv = (period) => {
    const periodOrders = getOrdersForPeriod(period);
    const headers = ['Product name', 'Category', 'Quantity', 'Order ID', 'Payment ID', 'Customer name', 'Customer phone', 'Customer address', 'Buyer email', 'Date', 'Price'];
    const csv = [
      headers.map(csvEscape).join(','),
      ...periodOrders.map((order) => orderToRow(order).map(csvEscape).join(','))
    ].join('\n');

    downloadFile(`automart-${period}-seller-sales.csv`, csv);
  };

  const downloadOrderReceipt = (order) => {
    downloadFile(`automart-sale-${order.orderId}.txt`, buildReceipt(order), 'text/plain;charset=utf-8;');
  };

  return (
    <div className="cro-page">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-extrabold uppercase text-emerald-800">
              <BarChart3 className="h-4 w-4" />
              Seller only
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-olx-dark sm:text-4xl">Seller sales</h1>
            <p className="mt-2 max-w-2xl text-olx-muted">
              Track sold products, revenue, buyer details, payment IDs, and listing status in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => downloadOrdersCsv('week')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-olx-border bg-white px-5 py-3 font-bold text-olx-dark shadow-premium transition hover:bg-slate-50"
            >
              <Download className="h-5 w-5" />
              Weekly CSV
            </button>
            <button
              type="button"
              onClick={() => downloadOrdersCsv('month')}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-olx-border bg-white px-5 py-3 font-bold text-olx-dark shadow-premium transition hover:bg-slate-50"
            >
              <Download className="h-5 w-5" />
              Monthly CSV
            </button>
            <Link
              to="/add-part"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-olx-sell px-5 py-3 font-extrabold text-olx-dark shadow-md transition hover:brightness-105"
            >
              <Plus className="h-5 w-5" strokeWidth={2.5} />
              Add product
            </Link>
            <Link
              to="/my-listings"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-olx-border bg-white px-5 py-3 font-bold text-olx-dark shadow-premium transition hover:bg-slate-50"
            >
              <PackageOpen className="h-5 w-5" />
              My listings
            </Link>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Today sold"
            value={summary.today?.productsSold || 0}
            detail={formatCurrency(summary.today?.revenue)}
            icon={CalendarDays}
            tone="text-emerald-700"
          />
          <StatCard
            title="Last 7 days"
            value={summary.week?.productsSold || 0}
            detail={formatCurrency(summary.week?.revenue)}
            icon={TrendingUp}
            tone="text-sky-700"
          />
          <StatCard
            title="This month"
            value={summary.month?.productsSold || 0}
            detail={formatCurrency(summary.month?.revenue)}
            icon={ShoppingBag}
            tone="text-violet-700"
          />
          <StatCard
            title="All time revenue"
            value={formatCurrency(summary.allTime?.revenue)}
            detail={`${summary.allTime?.productsSold || 0} products sold`}
            icon={IndianRupee}
            tone="text-olx-dark"
          />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-xl border border-olx-border bg-white p-6 shadow-premium ring-1 ring-slate-900/5 lg:col-span-1">
            <h2 className="text-lg font-extrabold text-olx-dark">Listing health</h2>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between border-b border-olx-border pb-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-olx-muted">
                  <PackageOpen className="h-4 w-4" />
                  Available
                </span>
                <span className="font-extrabold text-emerald-700">{summary.listings?.available || 0}</span>
              </div>
              <div className="flex items-center justify-between border-b border-olx-border pb-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-olx-muted">
                  <Clock className="h-4 w-4" />
                  Pending
                </span>
                <span className="font-extrabold text-amber-700">{summary.listings?.pending || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-olx-muted">
                  <CheckCircle className="h-4 w-4" />
                  Sold
                </span>
                <span className="font-extrabold text-red-700">{summary.listings?.sold || 0}</span>
              </div>
              <div className="flex items-center justify-between border-t border-olx-border pt-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-olx-muted">
                  <PackageOpen className="h-4 w-4" />
                  Stock units
                </span>
                <span className="font-extrabold text-sky-700">{summary.listings?.stockAvailable || 0}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-olx-border bg-white p-6 shadow-premium ring-1 ring-slate-900/5 lg:col-span-2">
            <h2 className="text-lg font-extrabold text-olx-dark">Top sold products</h2>
            {topProducts.length === 0 ? (
              <p className="mt-5 text-sm text-olx-muted">No completed sales yet.</p>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {topProducts.map((product) => (
                  <div key={`${product.label}-${product.category}`} className="rounded-lg border border-olx-border bg-slate-50 p-4">
                    <p className="truncate font-extrabold text-olx-dark">{product.label}</p>
                    <p className="mt-1 text-sm text-olx-muted">{product.category}</p>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-bold text-olx-dark">{product.sold} sold</span>
                      <span className="font-extrabold text-emerald-700">{formatCurrency(product.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-olx-border bg-white shadow-premium ring-1 ring-slate-900/5">
          <div className="flex flex-col gap-2 border-b border-olx-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-olx-dark">Sold product details</h2>
              <p className="text-sm text-olx-muted">Completed payment orders only.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => downloadOrdersCsv('today')}
                className="inline-flex items-center gap-2 rounded-lg border border-olx-border px-3 py-2 text-sm font-bold text-olx-dark transition hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                Today
              </button>
              <button
                type="button"
                onClick={() => downloadOrdersCsv('all')}
                className="inline-flex items-center gap-2 rounded-lg border border-olx-border px-3 py-2 text-sm font-bold text-olx-dark transition hover:bg-slate-50"
              >
                <Download className="h-4 w-4" />
                All CSV
              </button>
              <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-olx-dark">
                <PackageCheck className="h-4 w-4" />
                {orders.length} records
              </span>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-extrabold text-olx-dark">No sales yet</p>
              <p className="mt-2 text-sm text-olx-muted">Completed buyer payments will appear here automatically.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-olx-border text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-olx-muted">
                  <tr>
                    <th className="px-5 py-3 font-extrabold">Product</th>
                    <th className="px-5 py-3 font-extrabold">Buyer</th>
                    <th className="px-5 py-3 font-extrabold">Buyer address</th>
                    <th className="px-5 py-3 font-extrabold">Qty</th>
                    <th className="px-5 py-3 font-extrabold">Sold date</th>
                    <th className="px-5 py-3 font-extrabold">Payment</th>
                    <th className="px-5 py-3 text-right font-extrabold">Price</th>
                    <th className="px-5 py-3 font-extrabold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-olx-border bg-white">
                  {orders.map((order) => (
                    <tr key={order._id} className="align-top">
                      <td className="px-5 py-4">
                        <p className="font-extrabold text-olx-dark">
                          {order.product ? `${order.product.brand} ${order.product.model}` : 'Deleted product'}
                        </p>
                        <p className="mt-1 text-xs text-olx-muted">
                          {order.product?.parts || 'Part'} {order.product?.year ? `- ${order.product.year}` : ''}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-olx-dark">{getCustomerName(order)}</p>
                        <p className="mt-1 text-xs font-semibold text-olx-dark">Phone: {getCustomerPhone(order)}</p>
                        <p className="mt-1 text-xs text-olx-muted">{order.buyer?.email || 'No email'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="max-w-72 whitespace-normal font-semibold text-olx-dark">{getCustomerAddress(order)}</p>
                      </td>
                      <td className="px-5 py-4 font-extrabold text-olx-dark">{order.quantity || 1}</td>
                      <td className="px-5 py-4 font-semibold text-olx-dark">{formatDate(order.soldAt)}</td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-olx-dark">{order.orderId}</p>
                        <p className="mt-1 text-xs text-olx-muted">{order.paymentId || 'Payment ID pending'}</p>
                      </td>
                      <td className="px-5 py-4 text-right font-extrabold text-emerald-700">{formatCurrency(order.amount)}</td>
                      <td className="px-5 py-4">
                        {order.product?._id ? (
                          <Link
                            to={`/parts/${order.product._id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-olx-border px-3 py-2 font-bold text-olx-dark transition hover:bg-slate-50"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        ) : (
                          <span className="text-xs font-bold text-olx-muted">Unavailable</span>
                        )}
                        <button
                          type="button"
                          onClick={() => downloadOrderReceipt(order)}
                          className="mt-2 inline-flex items-center gap-2 rounded-lg border border-olx-border px-3 py-2 font-bold text-olx-dark transition hover:bg-slate-50"
                        >
                          <Download className="h-4 w-4" />
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerSales;

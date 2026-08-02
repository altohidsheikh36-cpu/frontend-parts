import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Gauge, MapPin, Phone, Mail, User, Fuel, Cog, ArrowLeft, MessageCircle, Activity, Package } from 'lucide-react';
import { partService } from '../services/partService';
import { paymentService } from '../services/paymentService';
import { fullImageUrl, WHATSAPP_NUMBER } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';

const emptyCustomerDetails = {
  name: '',
  phone: '',
  address: '',
  pincode: '',
  city: '',
  state: ''
};

const VehicleDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(emptyCustomerDetails);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleWhatsAppInquiry = () => {
    const whatsappNumber = vehicle?.sellerId?.phone || WHATSAPP_NUMBER;
    const phoneNumber = whatsappNumber.replace(/[^0-9]/g, '');
    
    const message = `Hello! I'm interested in this vehicle:

${vehicle?.brand} ${vehicle?.model} (${vehicle?.year})
Price: ₹${vehicle?.price?.toLocaleString('en-IN')}
${vehicle?.kilometersDriven ? `Kilometers Driven: ${vehicle.kilometersDriven.toLocaleString('en-IN')} km` : ''}
${vehicle?.mileage ? `Mileage: ${vehicle.mileage}` : ''}

I would like to know more about this vehicle. Please share more details.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handlePayment = () => {
    if (!user) {
      alert('Please login to continue with payment');
      window.location.href = '/login';
      return;
    }

    setPaymentError('');
    setCustomerDetails({
      ...emptyCustomerDetails,
      name: user.name || '',
      phone: user.phone || ''
    });
    setShowCheckoutForm(true);
  };

  const handleCustomerDetailChange = (event) => {
    const { name, value } = event.target;
    setCustomerDetails((details) => ({
      ...details,
      [name]: value
    }));
  };

  const validateCustomerDetails = () => {
    const requiredFields = ['name', 'phone', 'address', 'pincode', 'city', 'state'];
    const hasMissingField = requiredFields.some((field) => !customerDetails[field].trim());

    if (hasMissingField) {
      return 'Please fill all customer details before payment.';
    }

    if (!/^[0-9]{10}$/.test(customerDetails.phone.replace(/\D/g, ''))) {
      return 'Please enter a valid 10 digit phone number.';
    }

    if (!/^[0-9]{6}$/.test(customerDetails.pincode.trim())) {
      return 'Please enter a valid 6 digit pincode.';
    }

    return '';
  };

  const handleCheckoutSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateCustomerDetails();
    if (validationError) {
      setPaymentError(validationError);
      return;
    }

    setPaymentProcessing(true);
    setPaymentError('');

    const sanitizedCustomerDetails = {
      name: customerDetails.name.trim(),
      phone: customerDetails.phone.replace(/\D/g, ''),
      address: customerDetails.address.trim(),
      pincode: customerDetails.pincode.trim(),
      city: customerDetails.city.trim(),
      state: customerDetails.state.trim()
    };

    try {
      // Step 1: Get Razorpay Key from backend
      const keyData = await paymentService.getRazorpayKey();
      
      if (!keyData.success) {
        throw new Error('Failed to get payment configuration');
      }

      // Step 2: Create order
      const orderData = await paymentService.createOrder(vehicle._id, 1, sanitizedCustomerDetails);

      // Step 3: Initialize Razorpay options
      const options = {
        key: keyData.key, // ✓ Now fetched from backend!
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        order_id: orderData.data.id,
        name: 'AutoMart',
        description: `${vehicle.brand} ${vehicle.model} (${vehicle.year})`,
        image: '/logo.png',
        handler: async function(response) {
          try {
            // Verify payment with backend
            const verifyData = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            if (verifyData.success) {
              alert('🎉 Payment successful! Your vehicle booking is confirmed.');
              window.location.reload(); // Refresh to update vehicle status
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed. Please contact support with Order ID: ' + response.razorpay_order_id);
          }
        },
        prefill: {
          name: sanitizedCustomerDetails.name,
          email: user.email,
          contact: sanitizedCustomerDetails.phone
        },
        notes: {
            partId: vehicle._id,
            buyerId: user.id,
            partName: `${vehicle.brand || ''} ${vehicle.model || vehicle.name || ''}`,
            customerName: sanitizedCustomerDetails.name,
            customerPhone: sanitizedCustomerDetails.phone,
            customerAddress: sanitizedCustomerDetails.address,
            customerPincode: sanitizedCustomerDetails.pincode,
            customerCity: sanitizedCustomerDetails.city,
            customerState: sanitizedCustomerDetails.state
          },
        theme: {
          color: '#002f34'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment cancelled by user');
            setPaymentProcessing(false);
            setShowCheckoutForm(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      
      razorpayInstance.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
        setPaymentProcessing(false);
      });

      razorpayInstance.open();
      setShowCheckoutForm(false);
      
    } catch (error) {
      console.error('Payment error:', error);
      const msg = error.message || 'Payment initialization failed';
      setPaymentError(msg);
      // Keep the user informed
      alert('Payment initialization failed: ' + msg);
      setPaymentProcessing(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const data = await partService.getPart(id);
      setVehicle(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cro-page flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-pulse rounded-xl bg-olx-teal/30" />
          <p className="text-sm font-bold text-olx-muted">Loading listing…</p>
        </div>

      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="cro-page flex flex-col items-center justify-center text-center">
        <p className="text-lg font-extrabold text-olx-dark">Listing not found</p>
        <p className="mt-2 max-w-sm text-olx-muted">It may have been removed. Browse similar parts below.</p>
        <Link to="/parts" className="mt-6 cro-btn-secondary px-8">
          Browse parts
        </Link>
      </div>
    );
  }

  return (
    <div className="cro-page">
      <div className="mx-auto max-w-7xl">
        <Link 
          to="/parts"
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-olx-dark transition hover:text-olx-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search results
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Image */}
            <div className="overflow-hidden rounded-2xl border border-olx-border bg-white shadow-premium-lg ring-1 ring-slate-900/5">
              <div className="h-56 sm:h-72 md:h-96 bg-gradient-to-br from-slate-100 to-slate-50">
                {vehicle.images && vehicle.images.length > 0 ? (
                  <img 
                    src={fullImageUrl(vehicle.images[currentImage].url)} 
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-9xl">
                    {vehicle.type === 'car' ? '🚗' : '🏍️'}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {vehicle.images && vehicle.images.length > 1 && (
                <div className="p-4 flex space-x-4 overflow-x-auto">
                  {vehicle.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={fullImageUrl(img.url)}
                      alt={`Thumbnail ${idx + 1}`}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                        currentImage === idx ? 'border-olx-dark opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="rounded-2xl border border-olx-border bg-white p-6 shadow-premium-lg ring-1 ring-slate-900/5 sm:p-8">
              <h2 className="mb-6 text-lg font-extrabold text-olx-dark">Vehicle details</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-olx-teal" />
                  <div>
                    <div className="text-olx-muted text-sm">Year</div>
                    <div className="text-olx-dark font-bold">{vehicle.year}</div>
                  </div>
                </div>

                {vehicle.kilometersDriven !== undefined && vehicle.kilometersDriven !== null && (
                  <div className="flex items-center space-x-3">
                    <Gauge className="w-5 h-5 text-olx-teal" />
                    <div>
                      <div className="text-olx-muted text-sm">Kilometers Driven</div>
                      <div className="text-olx-dark font-bold">{vehicle.kilometersDriven.toLocaleString('en-IN')} km</div>
                    </div>
                  </div>
                )}

                {vehicle.mileage && (
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-olx-teal" />
                    <div>
                      <div className="text-olx-muted text-sm">Mileage (Fuel Efficiency)</div>
                      <div className="text-olx-dark font-bold">{vehicle.mileage}</div>
                    </div>
                  </div>
                )}

                {vehicle.fuelType && (
                  <div className="flex items-center space-x-3">
                    <Fuel className="w-5 h-5 text-olx-teal" />
                    <div>
                      <div className="text-olx-muted text-sm">Fuel Type</div>
                      <div className="text-olx-dark font-bold">{vehicle.fuelType}</div>
                    </div>
                  </div>
                )}

                {vehicle.transmission && (
                  <div className="flex items-center space-x-3">
                    <Cog className="w-5 h-5 text-olx-teal" />
                    <div>
                      <div className="text-olx-muted text-sm">Transmission</div>
                      <div className="text-olx-dark font-bold">{vehicle.transmission}</div>
                    </div>
                  </div>
                )}

                {vehicle.ownership && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-olx-teal" />
                    <div>
                      <div className="text-olx-muted text-sm">Ownership</div>
                      <div className="text-olx-dark font-bold">{vehicle.ownership}</div>
                    </div>
                  </div>
                )}

                {vehicle.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-olx-teal" />
                    <div>
                      <div className="text-olx-muted text-sm">Location</div>
                      <div className="text-olx-dark font-bold">
                        {vehicle.location.city}, {vehicle.location.state}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <Package className="w-5 h-5 text-olx-teal" />
                  <div>
                    <div className="text-olx-muted text-sm">Available quantity</div>
                    <div className="text-olx-dark font-bold">
                      {Number(vehicle.quantity || 0) > 0 ? `${vehicle.quantity} in stock` : 'Out of stock'}
                    </div>
                  </div>
                </div>
              </div>

              {vehicle.description && (
                <div className="mt-6 pt-6 border-t border-olx-border">
                  <h3 className="text-olx-dark font-bold mb-3">Description</h3>
                  <p className="text-olx-muted leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mt-6 pt-6 border-t border-olx-border">
                  <h3 className="text-olx-dark font-bold mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-olx-bg text-olx-dark border border-olx-border rounded-full text-sm font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Price & Seller Info */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="sticky top-24 rounded-2xl border-2 border-olx-dark bg-white p-6 shadow-premium-lg ring-1 ring-slate-900/5 sm:p-7">
              <div className="mb-6">
                <p className="text-xs font-extrabold uppercase tracking-widest text-olx-muted">Asking price</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-olx-dark">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <div className="mt-3 text-3xl font-extrabold tabular-nums tracking-tight text-olx-dark">
                  ₹{vehicle.price.toLocaleString('en-IN')}
                </div>
                <p className="mt-2 text-xs font-medium text-olx-muted">Confirm final price, RC, and inspection with the seller before paying.</p>
              </div>

              {/* Seller Information */}
              <div className="border-t border-olx-border pt-6">
                <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-olx-muted">Seller</h3>
                
                {vehicle.sellerId && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-olx-teal" />
                      <div>
                        <div className="text-olx-muted text-sm">Name</div>
                        <div className="text-olx-dark font-semibold">{vehicle.sellerId.name}</div>
                      </div>
                    </div>

                    {vehicle.sellerId.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-olx-teal" />
                        <div>
                          <div className="text-olx-muted text-sm">Email</div>
                          <a 
                            href={`mailto:${vehicle.sellerId.email}`}
                            className="text-olx-dark font-semibold underline decoration-olx-teal hover:text-olx-muted transition"
                          >
                            {vehicle.sellerId.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {vehicle.sellerId.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-olx-teal" />
                        <div>
                          <div className="text-olx-muted text-sm">Phone</div>
                          <a 
                            href={`tel:${vehicle.sellerId.phone}`}
                            className="text-olx-dark font-semibold underline decoration-olx-teal hover:text-olx-muted transition"
                          >
                            {vehicle.sellerId.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {paymentError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
                    {paymentError}
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <button 
                    onClick={handleWhatsAppInquiry}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 font-extrabold text-white shadow-md transition hover:brightness-105 active:scale-[0.99]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Message on WhatsApp</span>
                  </button>

                  <button 
                    onClick={handlePayment}
                    disabled={paymentProcessing || String(vehicle.status).toLowerCase() === 'sold' || Number(vehicle.quantity || 0) < 1} 
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-olx-dark py-3.5 font-extrabold text-white shadow-cta transition hover:bg-[#0d3d42] hover:shadow-cta-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Phone className="h-5 w-5" />
                    <span>{String(vehicle.status).toLowerCase() === 'sold' || Number(vehicle.quantity || 0) < 1 ? 'Out of stock' : (paymentProcessing ? 'Opening payment...' : 'Pay & reserve')}</span>
                  </button>
                  <p className="text-center text-[11px] font-medium text-olx-muted">Secure checkout · You’ll get a receipt by email</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showCheckoutForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-olx-border bg-white p-6 shadow-premium-lg ring-1 ring-slate-900/5 sm:p-8">
              <div className="mb-5">
                <p className="text-xs font-extrabold uppercase tracking-widest text-olx-muted">Checkout details</p>
                <h2 className="mt-1 text-xl font-extrabold text-olx-dark">Enter customer details before payment</h2>
                <p className="mt-2 text-sm font-medium text-olx-muted">These details will be saved with your order and used for contact and delivery.</p>
              </div>

              {paymentError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">
                  {paymentError}
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-bold text-olx-dark">Full name</span>
                    <input
                      name="name"
                      value={customerDetails.name}
                      onChange={handleCustomerDetailChange}
                      className="w-full rounded-xl border border-olx-border bg-slate-50/90 px-4 py-3 text-olx-dark outline-none transition focus:border-olx-teal/50 focus:ring-2 focus:ring-olx-teal/25"
                      placeholder="Customer name"
                      autoComplete="name"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-bold text-olx-dark">Phone number</span>
                    <input
                      name="phone"
                      value={customerDetails.phone}
                      onChange={handleCustomerDetailChange}
                      className="w-full rounded-xl border border-olx-border bg-slate-50/90 px-4 py-3 text-olx-dark outline-none transition focus:border-olx-teal/50 focus:ring-2 focus:ring-olx-teal/25"
                      placeholder="10 digit mobile number"
                      inputMode="numeric"
                      autoComplete="tel"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1 block text-sm font-bold text-olx-dark">Address</span>
                  <textarea
                    name="address"
                    value={customerDetails.address}
                    onChange={handleCustomerDetailChange}
                    className="min-h-24 w-full rounded-xl border border-olx-border bg-slate-50/90 px-4 py-3 text-olx-dark outline-none transition focus:border-olx-teal/50 focus:ring-2 focus:ring-olx-teal/25"
                    placeholder="House number, street, area"
                    autoComplete="street-address"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block">
                    <span className="mb-1 block text-sm font-bold text-olx-dark">Pincode</span>
                    <input
                      name="pincode"
                      value={customerDetails.pincode}
                      onChange={handleCustomerDetailChange}
                      className="w-full rounded-xl border border-olx-border bg-slate-50/90 px-4 py-3 text-olx-dark outline-none transition focus:border-olx-teal/50 focus:ring-2 focus:ring-olx-teal/25"
                      placeholder="6 digits"
                      inputMode="numeric"
                      autoComplete="postal-code"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-bold text-olx-dark">City</span>
                    <input
                      name="city"
                      value={customerDetails.city}
                      onChange={handleCustomerDetailChange}
                      className="w-full rounded-xl border border-olx-border bg-slate-50/90 px-4 py-3 text-olx-dark outline-none transition focus:border-olx-teal/50 focus:ring-2 focus:ring-olx-teal/25"
                      placeholder="City"
                      autoComplete="address-level2"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-sm font-bold text-olx-dark">State</span>
                    <input
                      name="state"
                      value={customerDetails.state}
                      onChange={handleCustomerDetailChange}
                      className="w-full rounded-xl border border-olx-border bg-slate-50/90 px-4 py-3 text-olx-dark outline-none transition focus:border-olx-teal/50 focus:ring-2 focus:ring-olx-teal/25"
                      placeholder="State"
                      autoComplete="address-level1"
                    />
                  </label>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCheckoutForm(false);
                      setPaymentError('');
                    }}
                    disabled={paymentProcessing}
                    className="rounded-xl border-2 border-olx-border bg-white px-6 py-3 font-extrabold text-olx-dark transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={paymentProcessing}
                    className="rounded-xl bg-olx-dark px-6 py-3 font-extrabold text-white shadow-cta transition hover:bg-[#0d3d42] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {paymentProcessing ? 'Opening payment...' : 'Continue to payment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetail;

import React, { useState, useEffect } from 'react';

const VehiclePayment = ({ vehicleId, vehiclePrice, vehicleName, vehicleStatus }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Get auth token from localStorage or your auth context
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || '';
  };

  // Get user details from localStorage or your auth context
  const getUserDetails = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : {};
  };

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const authToken = getAuthToken();
      const user = getUserDetails();

      if (!authToken) {
        setError('Please login to continue with payment');
        setLoading(false);
        return;
      }

      // Step 1: Get Razorpay Key
      console.log('Fetching Razorpay key...');
      const keyResponse = await fetch('http://localhost:5173/api/payment/key', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const keyData = await keyResponse.json();

      if (!keyData.success) {
        throw new Error('Failed to get payment configuration');
      }

      console.log('Razorpay key fetched successfully');

      // Step 2: Create Order
      console.log('Creating order...');
      const orderResponse = await fetch('http://localhost:5173/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          vehicleId: vehicleId
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      console.log('Order created:', orderData.data.id);

      // Step 3: Initialize Razorpay Checkout
      const options = {
        key: keyData.key,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'AutoMart',
        description: `Purchase: ${vehicleName || 'Vehicle'}`,
        image: '/logo.png', // Your logo URL
        order_id: orderData.data.id,
        handler: async function (response) {
          console.log('Payment successful, verifying...');
          await verifyPayment(response, authToken);
        },
        prefill: {
          name: user.name || 'Customer',
          email: user.email || 'customer@example.com',
          contact: user.phone || '9999999999'
        },
        notes: {
          vehicleId: vehicleId,
          vehicleName: vehicleName
        },
        theme: {
          color: '#7C3AED'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            console.log('Payment cancelled by user');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      razorpay.open();

    } catch (error) {
      console.error('Payment Error:', error);
      setError(error.message || 'Payment initialization failed');
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentResponse, authToken) => {
    try {
      console.log('Verifying payment...');
      
      const verifyResponse = await fetch('http://localhost:5173/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature
        })
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        console.log('Payment verified successfully!');
        // Show success message
        alert('🎉 Payment Successful! Your vehicle purchase is confirmed.');
        
        // Redirect to success page or order details
        window.location.href = `/orders/${verifyData.data.orderId}`;
      } else {
        throw new Error(verifyData.message || 'Payment verification failed');
      }

    } catch (error) {
      console.error('Verification Error:', error);
      setError('Payment verification failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to normalize status
  const isSold = (vehicleStatus) => {
    if (!vehicleStatus) return false;
    return String(vehicleStatus).toLowerCase() === 'sold';
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Complete Your Purchase</h2>
        
        {vehicleName && (
          <div className="vehicle-info">
            <h3>{vehicleName}</h3>
            <p className="price">₹{vehiclePrice?.toLocaleString('en-IN')}</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading || isSold(vehicleStatus)}
          className="pay-button"
        >
          {isSold(vehicleStatus)
            ? 'Sold'
            : loading
              ? 'Processing...'
              : `Pay ₹${vehiclePrice?.toLocaleString('en-IN')}`}
        </button>

        <div className="payment-info">
          <p>🔒 Secure payment powered by Razorpay</p>
          <p>💳 We accept Credit Card, Debit Card, Net Banking, UPI & more</p>
        </div>
      </div>

      <style jsx>{`
        .payment-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          padding: 20px;
        }

        .payment-card {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 100%;
        }

        h2 {
          margin: 0 0 24px 0;
          color: #1f2937;
          font-size: 24px;
          text-align: center;
        }

        .vehicle-info {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .vehicle-info h3 {
          margin: 0 0 8px 0;
          color: #374151;
          font-size: 18px;
        }

        .price {
          margin: 0;
          color: #7c3aed;
          font-size: 28px;
          font-weight: bold;
        }

        .error-message {
          background: #fee2e2;
          border: 1px solid #ef4444;
          color: #991b1b;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .pay-button {
          width: 100%;
          background: #7c3aed;
          color: white;
          border: none;
          padding: 16px;
          font-size: 18px;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .pay-button:hover:not(:disabled) {
          background: #6d28d9;
        }

        .pay-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .payment-info {
          margin-top: 24px;
          text-align: center;
        }

        .payment-info p {
          margin: 8px 0;
          color: #6b7280;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default VehiclePayment;
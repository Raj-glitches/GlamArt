import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const PaymentOptions = ({ 
  onPaymentMethodChange, 
  selectedMethod, 
  isLoading,
  onProceed 
}) => {
  const [showCardForm, setShowCardForm] = useState(false);

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: '💳',
      description: 'Secure card payments',
      processingFee: 0
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: '💳',
      description: 'International cards accepted',
      processingFee: 0
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💰',
      description: 'Pay when delivered',
      processingFee: 0
    },
    {
      id: 'upi',
      name: 'UPI (PhonePe, GPay)',
      icon: '📱',
      description: 'Instant UPI payments',
      processingFee: 0
    },
    {
      id: 'wallet',
      name: 'Wallets (Paytm, AmazonPay)',
      icon: '💼',
      description: 'Paytm, PhonePe, AmazonPay',
      processingFee: 0
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        💳 Secure Payment
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
          100% Safe
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {paymentMethods.map((method) => (
          <motion.button
            key={method.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPaymentMethodChange(method.id)}
            className={`group relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-2xl ${
              selectedMethod === method.id
                ? 'border-primary-500 bg-primary-50 shadow-lg ring-2 ring-primary-200 ring-opacity-50'
                : 'border-gray-200 hover:border-primary-200 hover:bg-primary-50'
            }`}
            disabled={isLoading}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl p-2 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                {method.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-primary-600">
                  {method.name}
                </h4>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
              {selectedMethod === method.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                >
                  ✓
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedMethod === 'razorpay' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t pt-6"
          >
            <h4 className="font-bold text-gray-900 mb-4">Razorpay</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="label">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="input"
                  disabled
                />
              </div>
              <div>
                <label className="label">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="input"
                  disabled
                />
              </div>
              <div className="md:col-span-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="input"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="label">Name on Card</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="input"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-600 mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Secure payment powered by Razorpay. Your data is encrypted.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        disabled={isLoading}
        onClick={onProceed}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center gap-2 justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing Payment...</span>
          </div>
        ) : (
          'Complete Secure Payment'
        )}
      </motion.button>

      <div className="mt-6 pt-6 border-t text-xs text-gray-500 text-center">
        <p>Protected by SSL encryption • Secure payment gateway • 24/7 support</p>
      </div>
    </motion.div>
  );
};

export default PaymentOptions;


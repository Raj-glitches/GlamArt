import { motion } from 'framer-motion';

const PaymentOptions = ({
  onPaymentMethodChange,
  selectedMethod,
  isLoading,
  onProceed,
}) => {

  const paymentMethods = [
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: '💳',
      description:
        'Cards, UPI, Net Banking & Wallets',
      badge: 'Recommended',
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: '💎',
      description:
        'Visa, Mastercard, International Payments',
      badge: 'International',
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💰',
      description:
        'Pay after product delivery',
      badge: null,
    },
  ];

  const renderPaymentInfo = () => {

    switch (selectedMethod) {

      case 'razorpay':
        return (
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <h4 className="mb-2 text-lg font-semibold text-gray-800">
              💳 Razorpay Payment
            </h4>

            <p className="text-sm text-gray-600 mb-4">
              Supports:
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                'UPI',
                'Visa',
                'Mastercard',
                'RuPay',
                'Net Banking',
                'Wallets',
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
              <span>🔒</span>
              <span>
                Secure checkout powered by Razorpay
              </span>
            </div>
          </div>
        );

      case 'stripe':
        return (
          <div className="mt-6 rounded-xl border border-purple-100 bg-purple-50 p-5">
            <h4 className="mb-2 text-lg font-semibold text-gray-800">
              💎 Stripe Payment
            </h4>

            <p className="text-sm text-gray-600 mb-4">
              Supports international and domestic cards securely.
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                'Visa',
                'Mastercard',
                'American Express',
                'Apple Pay',
                'Google Pay',
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
              <span>🔒</span>
              <span>
                Secure checkout powered by Stripe
              </span>
            </div>
          </div>
        );

      case 'cod':
        return (
          <div className="mt-6 rounded-xl border border-yellow-100 bg-yellow-50 p-5">
            <h4 className="mb-2 text-lg font-semibold text-gray-800">
              💰 Cash on Delivery
            </h4>

            <p className="text-sm text-gray-700">
              Pay using cash when your order arrives
              at your doorstep.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="bg-white rounded-2xl shadow-card p-6"
    >

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          💳 Secure Payment
        </h2>

        <p className="text-gray-500 mt-1">
          Choose your preferred payment method
        </p>
      </div>

      {/* Security Banner */}
      <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-2 text-green-700">
          <span className="text-lg">🔒</span>

          <div>
            <p className="font-semibold">
              100% Secure Checkout
            </p>

            <p className="text-sm text-green-600">
              Your payment information is encrypted and protected
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">

        {paymentMethods.map((method) => {

          const isSelected =
            selectedMethod === method.id;

          return (
            <motion.button
              key={method.id}

              whileHover={{
                scale: 1.01,
              }}

              whileTap={{
                scale: 0.99,
              }}

              type="button"

              disabled={isLoading}

              onClick={() =>
                onPaymentMethodChange(
                  method.id
                )
              }

              className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-lg'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
            >

              <div className="flex items-start justify-between">

                <div className="flex gap-4">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                    {method.icon}
                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <h3 className="text-lg font-bold text-gray-900">
                        {method.name}
                      </h3>

                      {method.badge && (
                        <span className="rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-700">
                          {method.badge}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-600">
                      {method.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500 text-sm text-white">
                    ✓
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Payment Info */}
      {renderPaymentInfo()}

      {/* Proceed Button */}
      <button
        type="button"

        disabled={isLoading}

        onClick={onProceed}

        className="btn-primary mt-8 w-full py-4 text-lg font-semibold"
      >

        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>

            <span>
              Processing...
            </span>
          </div>
        ) : (
          <>
            {selectedMethod === 'cod'
              ? 'Place Order'
              : `Pay Securely with ${
                  selectedMethod === 'stripe'
                    ? 'Stripe'
                    : 'Razorpay'
                }`}
          </>
        )}
      </button>

      {/* Footer */}
      <div className="mt-5 text-center text-xs text-gray-500">
        SSL Secured Checkout • Encrypted Payments • Trusted Payment Gateway
      </div>
    </motion.div>
  );
};

export default PaymentOptions;
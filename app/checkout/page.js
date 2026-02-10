import CheckoutSidebar from '@/app/components/checkout/CheckoutSidebar';
import CheckoutSteps from '@/app/components/checkout/CheckoutSteps';
import ShippingForm from '@/app/components/checkout/ShippingForm';


export const metadata = {
  title: 'Checkout - Merkato',
  description: 'Complete your purchase',
};

export default function CheckoutPage() {
  return (
    
      <div className="min-h-screen bg-gray-50">
        {/* Header Area */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600 mt-2">Complete your purchase securely</p>
          </div>
        </div>

        {/* Checkout Steps */}
        <div className="container mx-auto px-4 py-6">
          <CheckoutSteps currentStep={1} />
        </div>

        {/* Main Checkout Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Forms */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Shipping Information
                </h2>
                <ShippingForm />
              </div>

              {/* Payment Section (Placeholder for now) */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Payment Method
                </h2>
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-4">Payment form will be added in Phase 3</p>
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-1/3">
              <CheckoutSidebar />
            </div>
          </div>
        </div>
      </div>
    
  );
}
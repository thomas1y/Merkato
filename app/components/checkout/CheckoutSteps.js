'use client';

import { useSelector } from 'react-redux';
import { selectCurrentStep } from '@/app/lib/store/features/checkout/selectors';

export default function CheckoutSteps() {
  const currentStep = useSelector(selectCurrentStep);
  
  const steps = [
    { number: 1, label: 'Shipping' },
    { number: 2, label: 'Payment' },
    { number: 3, label: 'Review' },
  ];

  return (
    <div className="w-full">
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const stepStatus = 
            step.number === currentStep ? 'current' :
            step.number < currentStep ? 'completed' : 'upcoming';
            
          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${stepStatus === 'completed' 
                      ? 'bg-green-600 text-white' 
                      : stepStatus === 'current'
                      ? 'bg-blue-600 text-white border-2 border-blue-600'
                      : 'bg-gray-200 text-gray-500'
                    }
                    font-semibold
                  `}
                >
                  {stepStatus === 'completed' ? '✓' : step.number}
                </div>
                <span className="text-sm font-medium mt-2 text-gray-700">
                  {step.label}
                </span>
              </div>

              {/* Connecting Line (except for last step) */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${stepStatus === 'completed' ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-blue-600">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.label}
          </p>
          <span className="text-sm text-gray-500">
            {currentStep === 1 ? 'Shipping Info' : 
             currentStep === 2 ? 'Payment Details' : 
             'Order Review'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
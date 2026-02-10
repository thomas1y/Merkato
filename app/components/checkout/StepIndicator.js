'use client';

import { useSelector } from 'react-redux';
import { selectCurrentStep } from '@/app/lib/store/features/checkout/selectors';

export default function StepIndicator() {
  const currentStep = useSelector(selectCurrentStep);
  
  const steps = [
    { number: 1, label: 'Shipping', description: 'Enter delivery information' },
    { number: 2, label: 'Payment', description: 'Select payment method' },
    { number: 3, label: 'Review', description: 'Confirm your order' },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        {/* Current Step Info */}
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold text-gray-900">
            {steps[currentStep - 1]?.label}
          </h3>
          <p className="text-sm text-gray-600">
            {steps[currentStep - 1]?.description}
          </p>
        </div>
        
        {/* Progress Dots */}
        <div className="flex items-center space-x-2">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${step.number === currentStep 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                    : step.number < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {step.number < currentStep ? '✓' : step.number}
              </div>
              {step.number < steps.length && (
                <div
                  className={`
                    w-8 h-1 mx-1
                    ${step.number < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Start</span>
          <span>Complete</span>
        </div>
      </div>
    </div>
  );
}
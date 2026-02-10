// Basic validation functions
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  // Remove all non-digits
  const digitsOnly = phone.replace(/\D/g, '');
  // Check if it's at least 10 digits
  return digitsOnly.length >= 10;
};

export const validateZipCode = (zipCode) => {
  // Accepts 5 digits or 5-4 format
  const re = /^\d{5}(-\d{4})?$/;
  return re.test(zipCode);
};

// Shipping form validation
export const validateShippingForm = (formData) => {
  const errors = {};

  if (!formData.firstName?.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!formData.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!formData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number (at least 10 digits)';
  }

  if (!formData.address?.trim()) {
    errors.address = 'Address is required';
  }

  if (!formData.city?.trim()) {
    errors.city = 'City is required';
  }

  if (!formData.state?.trim()) {
    errors.state = 'State is required';
  }

  if (!formData.zipCode?.trim()) {
    errors.zipCode = 'ZIP code is required';
  } else if (!validateZipCode(formData.zipCode)) {
    errors.zipCode = 'Please enter a valid ZIP code (5 digits or 5-4 format)';
  }

  return errors;
};

export const validateCardNumber = (cardNumber) => {
  const digitsOnly = cardNumber.replace(/\s/g, '');
  return digitsOnly.length === 16 && /^\d+$/.test(digitsOnly);
};

export const validateExpiryDate = (expiryDate) => {
  const re = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!re.test(expiryDate)) return false;
  
  const [month, year] = expiryDate.split('/');
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  
  const expiryYear = parseInt(year);
  const expiryMonth = parseInt(month);
  
  if (expiryYear < currentYear) return false;
  if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
  
  return true;
};

export const validateCVV = (cvv) => {
  return cvv.length === 3 && /^\d+$/.test(cvv);
};

export const validatePaymentForm = (paymentInfo, billingAddress) => {
  const errors = {};

  if (paymentInfo.method === 'credit_card') {
    if (!validateCardNumber(paymentInfo.cardNumber)) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    if (!paymentInfo.cardName?.trim()) {
      errors.cardName = 'Cardholder name is required';
    }
    if (!validateExpiryDate(paymentInfo.expiryDate)) {
      errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    if (!validateCVV(paymentInfo.cvv)) {
      errors.cvv = 'Please enter a valid 3-digit CVV';
    }
  }

  if (!billingAddress.sameAsShipping) {
    if (!billingAddress.firstName?.trim()) {
      errors.billingFirstName = 'First name is required';
    }
    if (!billingAddress.lastName?.trim()) {
      errors.billingLastName = 'Last name is required';
    }
    if (!billingAddress.address?.trim()) {
      errors.billingAddress = 'Address is required';
    }
    if (!billingAddress.city?.trim()) {
      errors.billingCity = 'City is required';
    }
    if (!billingAddress.state?.trim()) {
      errors.billingState = 'State is required';
    }
    if (!billingAddress.zipCode?.trim()) {
      errors.billingZipCode = 'ZIP code is required';
    }
  }

  return errors;
};
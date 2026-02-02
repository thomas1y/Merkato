

// Format price with currency
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Generate star rating
export const generateStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('★');
  }
  
  if (hasHalfStar) {
    stars.push('½');
  }
  
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push('☆');
  }
  
  return stars.join('');
};
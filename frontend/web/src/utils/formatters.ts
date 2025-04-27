/**
 * Format date string to a more readable format
 * Input format: ISO date string (2023-07-15T00:00:00Z)
 * Output format: July 15, 2023
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number): string => {
  if (amount === undefined || amount === null) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Format distance in km
 */
export const formatWeight = (weight: number): string => {
  if (weight === undefined || weight === null) return 'N/A';
  
  return `${weight.toFixed(1)} kg`;
};

/**
 * Format volume in cubic meters
 */
export const formatVolume = (volume: number): string => {
  if (volume === undefined || volume === null) return 'N/A';
  
  return `${volume.toFixed(2)} m³`;
}; 
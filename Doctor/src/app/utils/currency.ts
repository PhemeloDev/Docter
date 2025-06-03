// Currency configuration
export const CURRENCY_CONFIG = {
  ZAR: {
    symbol: 'R',
    code: 'ZAR',
    name: 'South African Rand',
    position: 'before' // R150
  },
  USD: {
    symbol: '$',
    code: 'USD', 
    name: 'US Dollar',
    position: 'before' // $150
  },
  GBP: {
    symbol: '£',
    code: 'GBP',
    name: 'British Pound',
    position: 'before' // £150
  },
  EUR: {
    symbol: '€',
    code: 'EUR',
    name: 'Euro',
    position: 'before' // €150
  }
};

// Default currency for South Africa
export const DEFAULT_CURRENCY = 'ZAR';

// Format currency amount
export const formatCurrency = (amount: number, currencyCode: string = DEFAULT_CURRENCY): string => {
  const config = CURRENCY_CONFIG[currencyCode as keyof typeof CURRENCY_CONFIG] || CURRENCY_CONFIG.USD;
  
  // Format number with proper separators
  const formattedAmount = new Intl.NumberFormat('en-ZA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  
  if (config.position === 'before') {
    return `${config.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount}${config.symbol}`;
  }
};

// Convert USD prices to ZAR (approximate conversion rate)
export const convertToZAR = (usdAmount: number): number => {
  const USD_TO_ZAR_RATE = 18.5; // Approximate rate - in production, use live rates
  return Math.round(usdAmount * USD_TO_ZAR_RATE);
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode: string = DEFAULT_CURRENCY): string => {
  const config = CURRENCY_CONFIG[currencyCode as keyof typeof CURRENCY_CONFIG] || CURRENCY_CONFIG.USD;
  return config.symbol;
}; 
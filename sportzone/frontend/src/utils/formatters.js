export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString));
};

/**
 * Normalizes size strings to clean standard sizes (e.g. 'UK 9 (IND 9)' -> '9', 'US 10' -> '9', 'UK 8' -> '8')
 * Strips any UK, IND, US prefixes and extra parentheses.
 */
export const formatNormalSize = (size) => {
  if (!size) return '';
  const trimmed = String(size).trim();

  // Known US conversions to standard size
  const usToNormal = {
    'US 6': '5',
    'US 6.5': '5.5',
    'US 7': '6',
    'US 7.5': '6.5',
    'US 8': '7',
    'US 8.5': '7.5',
    'US 9': '8',
    'US 9.5': '8.5',
    'US 10': '9',
    'US 10.5': '9.5',
    'US 11': '10',
    'US 11.5': '10.5',
    'US 12': '11',
  };

  if (usToNormal[trimmed]) return usToNormal[trimmed];

  // Strip UK and IND and parenthesis if present
  const cleaned = trimmed
    .replace(/\b(UK|IND)\b/gi, '')
    .replace(/[()]/g, '')
    .trim();

  // If formatted as repeated tokens like "9 9", pick the first one
  const tokens = cleaned.split(/\s+/);
  if (tokens.length >= 1 && tokens[0] && !isNaN(tokens[0])) {
    return tokens[0];
  }

  return cleaned || trimmed;
};

// Backwards-compatible alias
export const formatIndianSize = formatNormalSize;

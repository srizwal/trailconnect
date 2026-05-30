// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};

// Truncate text
export const truncate = (str, n = 120) => str?.length > n ? str.slice(0, n) + '…' : str;

// Get difficulty color
export const difficultyColor = (d) => ({
  easy: '#22c55e', moderate: '#f59e0b', hard: '#f97316', extreme: '#ef4444'
}[d] || '#8fa396');

// Get available seats
export const getAvailableSeats = (trek) => {
  if (!trek) return 0;
  const confirmed = trek.members?.filter(m => m.status === 'confirmed').length || 0;
  return Math.max(0, trek.totalSeats - confirmed);
};

// Build conversation ID from two user IDs
export const getConversationId = (id1, id2) =>
  [id1, id2].sort().join('_');

// Format large numbers
export const formatNumber = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
};

// Is trek joinable
export const isTrekJoinable = (trek) =>
  trek?.status === 'upcoming' && new Date(trek.date) > new Date();

// Build Google avatar fallback
export const avatarUrl = (name, size = 80) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=1a4a35&color=fff&size=${size}`;

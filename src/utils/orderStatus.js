import { getOrderallStatus } from '../api/apicall';

// Status mapping for the new format
export const ORDER_STATUS = {
  1: 'PLACED',
  2: 'PROCESSED', 
  3: 'SHIPPED',
  4: 'REACHED HUB',
  5: 'OUT FOR DELIVERY',
  6: 'DELIVERED',
  7: 'CANCELED'
};

// Reverse mapping for status to ID
export const STATUS_TO_ID = {
  'PLACED': 1,
  'PROCESSED': 2,
  'SHIPPED': 3,
  'REACHED HUB': 4,
  'OUT FOR DELIVERY': 5,
  'DELIVERED': 6,
  'CANCELED': 7
};

// Get status badge class based on status
export const getStatusBadgeClass = (status) => {
  const statusUpper = typeof status === 'string' ? status.toUpperCase() : ORDER_STATUS[status]?.toUpperCase();
  
  switch (statusUpper) {
    case 'PLACED':
      return 'bg-info text-white';
    case 'PROCESSED':
      return 'bg-primary text-white';
    case 'SHIPPED':
      return 'bg-warning text-dark';
    case 'REACHED HUB':
      return 'bg-secondary text-white';
    case 'OUT FOR DELIVERY':
      return 'bg-warning text-dark';
    case 'DELIVERED':
      return 'bg-success text-white';
    case 'CANCELED':
      return 'bg-danger text-white';
    default:
      return 'bg-light text-dark';
  }
};

// Get status display text
export const getStatusDisplayText = (status) => {
  if (typeof status === 'number') {
    return ORDER_STATUS[status] || 'Unknown';
  }
  return status || 'Unknown';
};

// Get status ID from text
export const getStatusId = (statusText) => {
  return STATUS_TO_ID[statusText?.toUpperCase()] || null;
};

// Fetch all available statuses from API
export const fetchAllStatuses = async () => {
  try {
    const response = await getOrderallStatus();
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch order statuses:', error);
    // Return default statuses if API fails
    return [
      { id: 1, status: 'PLACED' },
      { id: 2, status: 'PROCESSED' },
      { id: 3, status: 'SHIPPED' },
      { id: 4, status: 'REACHED HUB' },
      { id: 5, status: 'OUT FOR DELIVERY' },
      { id: 6, status: 'DELIVERED' },
      { id: 7, status: 'CANCELED' }
    ];
  }
};

// Check if status is a final status (delivered or canceled)
export const isFinalStatus = (status) => {
  const statusText = getStatusDisplayText(status).toUpperCase();
  return statusText === 'DELIVERED' || statusText === 'CANCELED';
};

// Get next possible statuses for a given status
export const getNextPossibleStatuses = (currentStatus) => {
  const currentStatusText = getStatusDisplayText(currentStatus).toUpperCase();
  
  switch (currentStatusText) {
    case 'PLACED':
      return [{ id: 2, status: 'PROCESSED' }, { id: 7, status: 'CANCELED' }];
    case 'PROCESSED':
      return [{ id: 3, status: 'SHIPPED' }, { id: 7, status: 'CANCELED' }];
    case 'SHIPPED':
      return [{ id: 4, status: 'REACHED HUB' }, { id: 7, status: 'CANCELED' }];
    case 'REACHED HUB':
      return [{ id: 5, status: 'OUT FOR DELIVERY' }, { id: 7, status: 'CANCELED' }];
    case 'OUT FOR DELIVERY':
      return [{ id: 6, status: 'DELIVERED' }, { id: 7, status: 'CANCELED' }];
    case 'DELIVERED':
    case 'CANCELED':
      return []; // Final statuses
    default:
      return [];
  }
};

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getOrdersOfCustomer, getAllProducts, updateOrderStatus } from '../api/apicall.js';

const OrderHistory = () => {
  const user = useSelector((state) => state.userinfo.user);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchData(user.id);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchData = async (customerId) => {
    try {
      setLoading(true);
      setError('');

      const [ordersRes, productsRes] = await Promise.all([
        getOrdersOfCustomer(customerId),
        getAllProducts()
      ]);

      const fetchedOrders = ordersRes.data || [];
      const fetchedProducts = productsRes.data || [];

      setOrders(fetchedOrders);
      setProducts(fetchedProducts);

      if (fetchedOrders.length === 0) {
        setError('No orders found. Place your first order to see it here!');
      }

    } catch (err) {
      console.error("Failed to fetch order data:", err);

      if (err.response?.status === 404) {
        setError('Order history service is not available. Please check if the backend server is running.');
      } else if (err.response?.status === 401) {
        setError('You are not authorized to view this data. Please log in again.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Unable to connect to the server. Please check your internet connection and ensure the backend server is running.');
      } else {
        setError('Failed to load order history. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getProductDetails = (productId) =>
    products.find(p => p.productId === productId || p.id === productId);

  const getStatusInfo = (status) => {
    const normalizedStatus = (status || '').toUpperCase();

    const statusMap = {
      'PLACED': { class: 'bg-warning text-dark', text: 'Placed' },
      'PROCESSED': { class: 'bg-info text-white', text: 'Processed' },
      'SHIPPED': { class: 'bg-primary text-white', text: 'Shipped' },
      'REACHED HUB': { class: 'bg-secondary text-white', text: 'Reached Hub' },
      'OUT FOR DELIVERY': { class: 'bg-primary text-white', text: 'Out for Delivery' },
      'DELIVERED': { class: 'bg-success text-white', text: 'Delivered' },
      'CANCELED': { class: 'bg-danger text-white', text: 'Canceled' },
    };

    return statusMap[normalizedStatus] || { class: 'bg-dark text-white', text: status || 'Unknown' };
  };

  // Check if order can be canceled (only PLACED or PROCESSED orders can be canceled)
  const canCancelOrder = (status) => {
    const normalizedStatus = (status || '').toUpperCase();
    return normalizedStatus === 'PLACED' || normalizedStatus === 'PROCESSED' || normalizedStatus === 'SHIPPED';
  };

  // Cancel order function - only customers can cancel their own orders
  const handleCancelOrder = async (Orderid, currentStatus) => {
    if (!canCancelOrder(currentStatus)) {
      alert('This order cannot be canceled. Orders can only be canceled when they are in PLACED or PROCESSED status.');
      return;
    }
    const update = {orderId:Orderid,status:7}

    const confirmed = window.confirm(
      '⚠️ Cancel Order\n\n' +
      'Are you sure you want to cancel this order?\n' +
      'This action cannot be undone.\n\n' +
      'Click OK to cancel the order.'
    );

    if (!confirmed) return;

 var res = await updateOrderStatus(update);
 console.log(res);
 if (res.status === 200) {
  alert('Order canceled successfully!');
  fetchData(user.id);
} else {
  alert('Failed to cancel order. Please try again later.');
}
  };

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>Access Denied</h4>
          <p>Please log in to view your order history.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="skeleton-text title" style={{ height: '32px', width: '200px' }}></div>
          <div className="skeleton-button" style={{ height: '38px', width: '100px' }}></div>
        </div>
        <div className="row">
          {[1, 2, 3].map(i => (
            <div key={i} className="col-12 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="skeleton-text title mb-2" style={{ width: '200px' }}></div>
                  <div className="skeleton-text mb-2" style={{ width: '300px' }}></div>
                  <div className="skeleton-text mb-3" style={{ width: '250px' }}></div>
                  <div className="skeleton-text" style={{ width: '100%', height: '60px' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error}</p>
          <button
            className="btn btn-danger"
            onClick={() => fetchData(user.id)}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="fas fa-history me-2 text-danger"></i>
          Order History
        </h2>
        <button
          className="btn btn-outline-danger"
          onClick={() => fetchData(user.id)}
          disabled={loading}
        >
          <i className="fas fa-sync-alt me-2"></i>
          Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-clipboard-list fa-5x text-muted mb-3"></i>
          <h4>No orders found</h4>
          <p className="text-muted">Your order history will appear here once you place your first order.</p>
          <button
            className="btn btn-danger"
            onClick={() => window.location.href = '/'}
          >
            <i className="fas fa-shopping-bag me-2"></i>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="row">
          {orders.map((order, index) => {
            const orderId = order.orderId || order.id || order.orderNumber || `ORDER-${index + 1}`;
            const orderDate = order.orderDate || order.createdAt || order.date || new Date().toISOString();
            const totalAmount = order.totalAmount || order.totalPrice || order.total || 0;
            // Handle both old string format and new ID format for order status
            const rawStatus = order.statusId || order.status || order.orderStatus || 1;
            const orderStatus = typeof rawStatus === 'number' ?
              (['', 'PLACED', 'PROCESSED', 'SHIPPED', 'REACHED HUB', 'OUT FOR DELIVERY', 'DELIVERED', 'CANCELED'][rawStatus] || 'PLACED') :
              rawStatus;
            const statusInfo = getStatusInfo(orderStatus);
            const orderItems = order.products || order.orderItems || order.items || [];

            // Debug logging for first order
            if (index === 0) {
              console.log('Order debug:', {
                orderId,
                rawStatus,
                orderStatus,
                canCancel: canCancelOrder(orderStatus),
                rawOrder: order
              });
            }

            return (
              <div key={orderId} className="col-12 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <h5 className="card-title">
                          <i className="fas fa-receipt me-2 text-danger"></i>
                          Order #{orderId}
                        </h5>
                        <p className="text-muted mb-1">
                          <i className="fas fa-calendar me-2"></i>
                          Placed on: {new Date(orderDate).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {order.address && (
                          <p className="text-muted mb-1">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            Delivery Address: {order.address}
                          </p>
                        )}
                        {order.phone && (
                          <p className="text-muted mb-1">
                            <i className="fas fa-phone me-2"></i>
                            Contact: {order.phone}
                          </p>
                        )}
                      </div>
                      <div className="col-md-4 text-end">
                        <h5 className="text-danger mb-2">₹{totalAmount}</h5>
                        <span className={`badge ${statusInfo.class} fs-6`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>

                    <hr />

                    <div className="mt-3">
                      <h6 className="mb-3">
                        <i className="fas fa-box me-2"></i>
                        Order Items ({orderItems.length}):
                      </h6>
                      <div className="row">
                        {orderItems.length === 0 ? (
                          <div className="col-12">
                            <div className="alert alert-warning">
                              <i className="fas fa-exclamation-triangle me-2"></i>
                              No items found for this order
                            </div>
                          </div>
                        ) : (
                          orderItems.map((item, itemIndex) => {
                            const itemId = item.id || item.productId || itemIndex;
                            const productId = item.productId || item.id;
                            const product = getProductDetails(productId);
                            const itemName = item.name || product?.productName || product?.ProductName || `Product ${itemIndex + 1}`;
                            const itemPrice = item.price || product?.productPrice || product?.ProductPrice || 0;
                            const itemQuantity = item.quantity || 1;

                            return (
                              <div key={itemId} className="col-md-6 mb-2">
                                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                                  <div>
                                    <span className="fw-medium">{itemName}</span>
                                    <small className="text-muted d-block">
                                      Quantity: {itemQuantity} × ₹{(itemPrice / itemQuantity).toFixed(2)}
                                    </small>
                                  </div>
                                  <span className="text-danger fw-bold">
                                    ₹{(itemPrice).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {order.deliveryAgent && (
                      <div className="mt-3 p-3 bg-info bg-opacity-10 rounded">
                        <h6 className="text-info mb-2">
                          <i className="fas fa-truck me-2"></i>
                          Delivery Information
                        </h6>
                        <p className="mb-0">
                          <strong>Agent:</strong> {order.deliveryAgent.name}
                        </p>
                        {order.deliveryAgent.phone && (
                          <p className="mb-0">
                            <strong>Contact:</strong> {order.deliveryAgent.phone}
                          </p>
                        )}
                      </div>
                    )}


                    {/* Cancel Order Button - Only show for PLACED or PROCESSED orders */}

                    {canCancelOrder(orderStatus) && (
                      <div className="mt-3 pt-3 border-top">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted">
                              <i className="fas fa-info-circle me-1"></i>
                              You can cancel this order while it's in PLACED or PROCESSED status
                            </small>
                          </div>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleCancelOrder(orderId, orderStatus)}
                          >
                            <i className="fas fa-times me-2"></i>
                            Cancel Order
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getAllOrders,
  updateOrderStatus as apiUpdateOrderStatus,
  getAllCustomers,
  getCustomerById
} from '../api/apicall.js';
import {
  getStatusBadgeClass,
  getStatusDisplayText,
  fetchAllStatuses,
  getNextPossibleStatuses
} from '../utils/orderStatus.js';

const AgentPanel = () => {
  const user = useSelector((state) => state.userinfo.user);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null); // Track which order is being updated

  useEffect(() => {
    if (user?.id) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all orders, customers, and order statuses in parallel
      const [ordersResponse, customersResponse, statusesData] = await Promise.all([
        getAllOrders(),
        getAllCustomers(),
        fetchAllStatuses()
      ]);

      const allOrders = ordersResponse.data || [];
      const allCustomers = customersResponse.data || [];

      // Filter orders assigned to the current agent
      const agentOrders = allOrders.filter(order => {
        // Check different possible field names for agent assignment
        const assignedAgentId = order.agentId || order.deliveryAgentId || order.agent?.id || order.deliveryAgent?.id;
        return assignedAgentId && assignedAgentId.toString() === user.id.toString();
      });

      console.log('All orders:', allOrders.length);
      console.log('Agent orders:', agentOrders.length);
      console.log('Current agent ID:', user.id);

      setOrders(agentOrders);
      setCustomers(allCustomers);
      setOrderStatuses(statusesData || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setOrders([]);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatusId) => {
    if (!newStatusId) {
      alert('Please select a status');
      return;
    }

    // Find the status name for confirmation
    const selectedStatus = orderStatuses.find(s => s.id === parseInt(newStatusId));
    const statusName = selectedStatus ? selectedStatus.status : `Status ${newStatusId}`;

    const confirmed = window.confirm(
      `Are you sure you want to update Order #${orderId} to "${statusName}"?`
    );

    if (!confirmed) return;

    try {
      // Set loading state for this specific order
      setUpdatingStatus(orderId);

      console.log('Updating order status:', { orderId, status: newStatusId, statusName });

      const response = await apiUpdateOrderStatus({
        orderId: parseInt(orderId),
        status: parseInt(newStatusId)
      });

      console.log('Order status update response:', response);

      // Force refresh with delay to ensure backend is updated
      setTimeout(async () => {
        await fetchData();

        // Verify the status update
        const updatedOrders = await getAllOrders();
        const updatedOrder = updatedOrders.data?.find(o =>
          (o.orderId || o.id) === parseInt(orderId)
        );

        if (updatedOrder) {
          const updatedStatus = updatedOrder.statusId || updatedOrder.status || updatedOrder.orderStatus;
          console.log('Status update verification:', {
            orderId,
            expectedStatus: newStatusId,
            actualStatus: updatedStatus,
            statusName: getStatusDisplayText(updatedStatus)
          });
        }

        alert(`✅ Order #${orderId} status updated to "${statusName}" successfully!`);
      }, 500);

    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('❌ Failed to update order status: ' + (error.response?.data?.message || error.message));
    } finally {
      // Clear loading state
      setUpdatingStatus(null);
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(c =>
      c.customerId === customerId ||
      c.id === customerId ||
      c.userId === customerId
    );
    return customer?.name || customer?.customerName || customer?.Name || `Customer ${customerId}`;
  };



  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>Access Denied</h4>
          <p>Please log in as an agent to view this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-danger mb-1">
            <i className="fas fa-truck me-2"></i>
            Agent Panel
          </h2>
          <p className="text-muted mb-0">
            Welcome, Agent {user.username} (ID: {user.id})
          </p>
        </div>
        <button
          className="btn btn-outline-danger"
          onClick={fetchData}
          disabled={loading}
        >
          <i className="fas fa-sync-alt me-2"></i>
          Refresh Orders
        </button>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-clipboard-list me-2"></i>
                My Assigned Orders ({orders.length})
              </h5>

              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-truck fa-5x text-muted mb-3"></i>
                  <h4>No orders assigned yet</h4>
                  <p className="text-muted">
                    Orders assigned to you by the admin will appear here.<br />
                    Check back later or contact your administrator.
                  </p>
                  <button
                    className="btn btn-outline-danger"
                    onClick={fetchData}
                  >
                    <i className="fas fa-sync-alt me-2"></i>
                    Check for New Orders
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Phone</th>
                        <th>Delivery Address</th>
                        <th>Total Amount</th>
                        <th>Order Date</th>
                        <th>Current Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => {
                        // Handle different order data structures
                        const orderId = order.orderId || order.id || order.orderNumber;
                        const customerId = order.customerId || order.customer?.id || order.customer;
                        const customerName = getCustomerName(customerId);
                        const phone = order.phone || order.customerPhone || order.customer?.phone || 'N/A';
                        const address = order.address || order.deliveryAddress || order.shippingAddress || 'N/A';
                        const totalAmount = order.totalAmount || order.totalprice || order.totalPrice || order.total || 0;
                        const orderDate = order.orderDate || order.createdAt || order.date;
                        // Handle both old string format and new ID format for order status
                        const orderStatus = order.statusId || order.status || order.orderStatus || 1; // Default to PLACED (ID: 1)
                        const statusDisplayText = getStatusDisplayText(orderStatus);
                        const statusBadgeClass = getStatusBadgeClass(orderStatus);

                        return (
                          <tr key={orderId}>
                            <td>
                              <strong>#{orderId}</strong>
                            </td>
                            <td>
                              <div>
                                <i className="fas fa-user me-2 text-primary"></i>
                                <strong>{customerName}</strong>
                                
                              </div>
                            </td>
                            <td>
                              <i className="fas fa-phone me-1 text-success"></i>
                              {phone}
                            </td>
                            <td>
                              <i className="fas fa-map-marker-alt me-1 text-danger"></i>
                              {address}
                            </td>
                            <td>
                              <strong className="text-danger">₹{totalAmount}</strong>
                            </td>
                            <td>
                              {orderDate ? (
                                <small>
                                  {new Date(orderDate).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </small>
                              ) : (
                                'N/A'
                              )}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className={`badge ${statusBadgeClass} me-2`}>
                                  {statusDisplayText}
                                </span>
                                {updatingStatus === orderId && (
                                  <small className="text-muted">
                                    <i className="fas fa-arrow-right me-1"></i>
                                    Updating...
                                  </small>
                                )}
                              </div>
                            </td>
                            <td>
                              {updatingStatus === orderId ? (
                                <div className="d-flex align-items-center">
                                  <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                                    <span className="visually-hidden">Updating...</span>
                                  </div>
                                  <small className="text-primary">Updating status...</small>
                                </div>
                              ) : (
                                <select
                                  className="form-select form-select-sm"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      updateOrderStatus(orderId, e.target.value);
                                      // Reset dropdown after selection
                                      e.target.value = "";
                                    }
                                  }}
                                  defaultValue=""
                                  disabled={updatingStatus === orderId}
                                >
                                  <option value="">Update Status</option>
                                  {orderStatuses.length > 0 ? (
                                    orderStatuses
                                      .filter(status => {
                                        // Exclude CANCELED - only customers can cancel
                                        // Also exclude current status from dropdown
                                        const currentStatusId = (orderStatus || 1).toString();
                                        const statusId = status.id.toString();
                                        return status.status !== 'CANCELED' && statusId !== currentStatusId;
                                      })
                                      .map(status => (
                                        <option key={status.id} value={status.id}>
                                          {status.status}
                                        </option>
                                      ))
                                  ) : (
                                    // Fallback options if API statuses not loaded (excluding CANCELED and current status)
                                    <>
                                      {orderStatus !== 1 && <option value="1">PLACED</option>}
                                      {orderStatus !== 2 && <option value="2">PROCESSED</option>}
                                      {orderStatus !== 3 && <option value="3">SHIPPED</option>}
                                      {orderStatus !== 4 && <option value="4">REACHED HUB</option>}
                                      {orderStatus !== 5 && <option value="5">OUT FOR DELIVERY</option>}
                                      {orderStatus !== 6 && <option value="6">DELIVERED</option>}
                                    </>
                                  )}
                                </select>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delivery Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-danger">
                {orders.filter(o => o.status === 'Pending').length}
              </h5>
              <p className="card-text">Pending Orders</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-info">
                {orders.filter(o => o.status === 'Processing').length}
              </h5>
              <p className="card-text">Processing</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-primary">
                {orders.filter(o => o.status === 'Shipped').length}
              </h5>
              <p className="card-text">Shipped</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-success">
                {orders.filter(o => o.status === 'Delivered').length}
              </h5>
              <p className="card-text">Delivered</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPanel;

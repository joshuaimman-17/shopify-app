import React, { useState, useEffect } from 'react';
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  assignAgentToOrder,
  getAllAgents,
  getAllCustomers
} from '../api/apicall.js';
import {
  getStatusBadgeClass,
  getStatusDisplayText
} from '../utils/orderStatus.js';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [assigningAgent, setAssigningAgent] = useState(null); // Track which order is being assigned

  const [loading, setLoading] = useState(false);
  const [productForm, setProductForm] = useState({
    productName: '',
    productDescription: '',
    productPrice: '',
    productimageUrl: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchAgents();
    fetchCustomers();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      console.log('Orders response:', response.data);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await getAllAgents();
      setAgents(response.data);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await getAllCustomers();
      console.log('Customers response:', response.data);
      setCustomers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setCustomers([]);
    }
  };

  const getCustomerUsername = (customerId) => {
    const customer = customers.find(c =>
      c.customerId === customerId ||
      c.id === customerId ||
      c.userId === customerId
    );
    return customer?.username || customer?.customerUsername || customer?.Username || `Customer ${customerId}`;
  };

  const getAgentName = (agentId, order) => {
    // First try to get agent name from the order object itself
    if (order.deliveryAgent?.name) return order.deliveryAgent.name;
    if (order.agent?.name) return order.agent.name;
    if (order.deliveryAgent?.agentName) return order.deliveryAgent.agentName;
    if (order.agent?.agentName) return order.agent.agentName;
    if (order.deliveryAgent?.AgentName) return order.deliveryAgent.AgentName;
    if (order.agent?.AgentName) return order.agent.AgentName;

    // If not found in order, look up in agents list
    if (agentId) {
      const agent = agents.find(a =>
        a.agentId === agentId ||
        a.id === agentId ||
        a.userId === agentId ||
        a.agentId === parseInt(agentId) ||
        a.id === parseInt(agentId)
      );

      if (agent) {
        const name = agent.AgentName || agent.agentName || agent.name || agent.username || `Agent ${agentId}`;
        return name;
      }

      // If agent ID exists but agent not found in list, show ID
      return `Agent ${agentId}`;
    }

    return 'Not Assigned';
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        productName: productForm.productName,
        productDescription: productForm.productDescription,
        productPrice: parseFloat(productForm.productPrice),
        productimageUrl: productForm.productimageUrl
      };

      if (isEditing) {
        // Update existing product
        productData.productId = editingProduct.productId || editingProduct.ProductId || editingProduct.id;
        console.log('Updating product data:', productData);
        await updateProduct(productData);
        alert('Product updated successfully!');
        setIsEditing(false);
        setEditingProduct(null);
      } else {
        // Add new product
        console.log('Adding product data:', productData);
        await addProduct(productData);
        alert('Product added successfully!');
      }

      setProductForm({
        productName: '',
        productDescription: '',
        productPrice: '',
        productimageUrl: ''
      });

      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditing(true);
    setProductForm({
      productName: product.productName || product.ProductName || '',
      productDescription: product.productDescription || product.ProductDescription || '',
      productPrice: product.productPrice || product.ProductPrice || '',
      productimageUrl: product.productimageUrl || product.ProductimageUrl || product.productImageUrl || ''
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setProductForm({
      productName: '',
      productDescription: '',
      productPrice: '',
      productimageUrl: ''
    });
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        fetchProducts();
        alert('Product deleted successfully!');
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  const handleAssignAgent = async (orderId, agentId) => {
    if (!agentId) {
      alert('Please select an agent');
      return;
    }

    // Find agent name for confirmation
    const selectedAgent = agents.find(a =>
      (a.agentId || a.id) === parseInt(agentId) || (a.agentId || a.id) === agentId
    );
    const agentName = selectedAgent ?
      (selectedAgent.AgentName || selectedAgent.agentName || selectedAgent.name || `Agent ${agentId}`) :
      `Agent ${agentId}`;

    const confirmed = window.confirm(
      `Are you sure you want to assign "${agentName}" to Order #${orderId}?`
    );

    if (!confirmed) return;

    try {
      // Set loading state for this specific order
      setAssigningAgent(orderId);

      console.log('Assigning agent:', { orderId, agentId, agentName });

      const response = await assignAgentToOrder({
        orderId: parseInt(orderId),
        agentId: parseInt(agentId)
      });

      console.log('Agent assignment response:', response);

      // Force refresh with a small delay to ensure backend is updated
      setTimeout(async () => {
        await fetchOrders();
        await fetchAgents();

        // Verify the assignment was successful
        const updatedOrders = await getAllOrders();
        const updatedOrder = updatedOrders.data?.find(o =>
          (o.orderId || o.id) === parseInt(orderId) || (o.orderId || o.id) === orderId
        );

        if (updatedOrder) {
          const updatedAgentId = updatedOrder.agentId ||
                               updatedOrder.deliveryAgent?.id ||
                               updatedOrder.deliveryAgent?.agentId ||
                               updatedOrder.agent?.id ||
                               updatedOrder.agent?.agentId ||
                               updatedOrder.deliveryAgentId;

          console.log('Assignment verification:', {
            orderId,
            expectedAgentId: agentId,
            actualAgentId: updatedAgentId,
            updatedOrder
          });
        }

        alert(`✅ Agent "${agentName}" has been successfully assigned to Order #${orderId}!`);
      }, 500);

    } catch (error) {
      console.error('Failed to assign agent:', error);
      alert('❌ Failed to assign agent: ' + (error.response?.data?.message || error.message));
    } finally {
      // Clear loading state
      setAssigningAgent(null);
    }
  };



  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCloseOrderModal = () => {
    setSelectedOrder(null);
    setShowOrderModal(false);
  };

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter(order => {
    const orderId = (order.orderId || order.id || '').toString().toLowerCase();
    const customerName = getCustomerUsername(order.customerId || order.customer?.id || order.customer).toLowerCase();
    const searchMatch = orderSearchTerm === '' ||
      orderId.includes(orderSearchTerm.toLowerCase()) ||
      customerName.includes(orderSearchTerm.toLowerCase());

    const statusMatch = orderStatusFilter === '' ||
      getStatusDisplayText(order.statusId || order.status || order.orderStatus || 1) === orderStatusFilter;

    return searchMatch && statusMatch;
  });










  //  const name = product.ProductName || product.productName;
  // const price = product.ProductPrice || product.productPrice;
  // const description = product.ProductDescription || product.productDescription;
  // const imageUrl = product.ProductimageUrl || product.productImageUrl;


  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-danger">Admin Panel</h2>
      
      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'agents' ? 'active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            Agents
          </button>
        </li>
      </ul>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-danger mb-0">
              <i className="fas fa-box me-2"></i>
              Products Management
            </h4>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-danger"
                onClick={fetchProducts}
                disabled={loading}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {isEditing ? 'Edit Product' : 'Add New Product'}
                  </h5>
                  <form onSubmit={handleProductSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Product Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={productForm.productName}
                        onChange={(e) => setProductForm({...productForm, productName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        value={productForm.productDescription}
                        onChange={(e) => setProductForm({...productForm, productDescription: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-control"
                        value={productForm.productPrice}
                        onChange={(e) => setProductForm({...productForm, productPrice: e.target.value})}
                        required
                      />
                    </div>
                    {/* <div className="mb-3">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productForm.stock}
                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                        required
                      />
                    </div> */}
                    <div className="mb-3">
                      <label className="form-label">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://example.com/image.jpg"
                        value={productForm.productimageUrl}
                        onChange={(e) => setProductForm({...productForm, productimageUrl: e.target.value})}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-danger flex-grow-1" disabled={loading}>
                        {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Product' : 'Add Product')}
                      </button>
                      {isEditing && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleCancelEdit}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Products List</h5>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product, index) => (
                          <tr key={product.productId}>
                            <td>{index + 1}</td>
                            <td>{product.productId}</td>
                            <td>{product.ProductName || product.productName}</td>
                            <td>₹{product.ProductPrice || product.productPrice}</td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <i className="fas fa-edit me-1"></i>
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleDeleteProduct(product.productId)}
                                >
                                  <i className="fas fa-trash me-1"></i>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">
                <i className="fas fa-shopping-cart me-2 text-danger"></i>
                Orders Management ({filteredOrders.length} of {orders.length})
              </h5>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-danger"
                  onClick={async () => {
                    await fetchOrders();
                    await fetchAgents();
                  }}
                  disabled={loading}
                >
                  <i className="fas fa-sync-alt me-2"></i>
                  Refresh All
                </button>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="row mb-3">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Order ID or Customer Name..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="PLACED">PLACED</option>
                  <option value="PROCESSED">PROCESSED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="REACHED HUB">REACHED HUB</option>
                  <option value="OUT FOR DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELED">CANCELED</option>
                </select>
              </div>
              <div className="col-md-3">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setOrderSearchTerm('');
                    setOrderStatusFilter('');
                  }}
                >
                  <i className="fas fa-times me-2"></i>
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Order Statistics */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body text-center">
                    <h4>{orders.length}</h4>
                    <small>Total Orders</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-dark">
                  <div className="card-body text-center">
                    <h4>{orders.filter(o => {
                      const status = getStatusDisplayText(o.statusId || o.status || o.orderStatus || 1);
                      return ['PLACED', 'PROCESSED'].includes(status.toUpperCase());
                    }).length}</h4>
                    <small>Pending Orders</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body text-center">
                    <h4>{orders.filter(o => {
                      const status = getStatusDisplayText(o.statusId || o.status || o.orderStatus || 1);
                      return status.toUpperCase() === 'DELIVERED';
                    }).length}</h4>
                    <small>Delivered Orders</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body text-center">
                    <h4>₹{orders.reduce((sum, o) => sum + (o.totalAmount || o.totalprice || o.totalPrice || o.total || 0), 0).toLocaleString()}</h4>
                    <small>Total Revenue</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Agent</th>
                    <th>Assign Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        {loading ? (
                          <div>
                            <div className="spinner-border text-danger me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Loading orders...
                          </div>
                        ) : (
                          <div className="text-muted">
                            <i className="fas fa-inbox fa-2x mb-2"></i>
                            <p>{orders.length === 0 ? 'No orders found' : 'No orders match your search criteria'}</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order, index) => {
                      // Handle different order data structures
                      const orderId = order.orderId || order.id || order.orderNumber || `ORDER-${index + 1}`;
                      const customerId = order.customerId || order.customer?.id || order.customer || 'Unknown';
                      const customerUsername = getCustomerUsername(customerId);
                      const totalPrice = order.totalAmount || order.totalprice || order.totalPrice || order.total || 0;
                      // Handle both old string format and new ID format for order status
                      const orderStatus = order.statusId || order.status || order.orderStatus || 1; // Default to PLACED (ID: 1)

                      // Extract agent ID from multiple possible sources
                      const agentId = order.agentId ||
                                    order.deliveryAgent?.id ||
                                    order.deliveryAgent?.agentId ||
                                    order.agent?.id ||
                                    order.agent?.agentId ||
                                    order.deliveryAgentId;

                      const agentName = getAgentName(agentId, order);

                      // Debug logging for agent assignment
                      if (agentId && index === 0) {
                        console.log('Agent assignment debug:', {
                          orderId,
                          agentId,
                          agentName,
                          orderAgentData: {
                            agentId: order.agentId,
                            deliveryAgent: order.deliveryAgent,
                            agent: order.agent,
                            deliveryAgentId: order.deliveryAgentId
                          }
                        });
                      }

                      // Debug logging for order data
                      if (index === 0) { // Only log for first order to avoid spam
                        console.log('Order data structure:', {
                          orderId,
                          customerId,
                          customerUsername,
                          totalPrice,
                          orderStatus,
                          agentId,
                          agentName,
                          rawOrderStatus: order.status,
                          rawStatusId: order.statusId,
                          rawAgentId: order.agentId,
                          fullOrder: order
                        });
                      }

                      // Get status display text and badge class
                      const statusDisplayText = getStatusDisplayText(orderStatus);
                      const statusBadgeClass = getStatusBadgeClass(orderStatus);

                      return (
                        <tr key={orderId}>
                          <td>{index + 1}</td>
                          <td>
                            <button
                              className="btn btn-link p-0 text-decoration-none"
                              onClick={() => handleViewOrderDetails(order)}
                              title="Click to view order details"
                            >
                              <strong className="text-danger">#{orderId}</strong>
                            </button>
                          </td>
                          <td>
                            <div>
                              <i className="fas fa-user me-2 text-primary"></i>
                              <strong>{customerUsername}</strong>
                              
                            </div>
                          </td>
                          <td>
                            <strong className="text-danger">₹{totalPrice}</strong>
                          </td>
                          <td>
                            <span className={`badge ${statusBadgeClass}`}>
                              {statusDisplayText}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="fas fa-truck me-2 text-primary"></i>
                              <span className={agentId ? 'text-success fw-bold' : 'text-muted'}>
                                {agentName}
                              </span>
                            </div>
                          </td>
                          <td>
                            {assigningAgent === orderId ? (
                              <div className="d-flex align-items-center">
                                <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                                  <span className="visually-hidden">Assigning...</span>
                                </div>
                                <small className="text-primary">Assigning agent...</small>
                              </div>
                            ) : agentId ? (
                              <div className="d-flex gap-2 align-items-center">
                                <span className="badge bg-success">
                                  <i className="fas fa-check me-1"></i>
                                  Assigned
                                </span>
                                <select
                                  className="form-select form-select-sm"
                                  onChange={(e) => {
                                    if (e.target.value && e.target.value !== agentId.toString()) {
                                      handleAssignAgent(orderId, e.target.value);
                                      // Reset dropdown after assignment
                                      e.target.value = "";
                                    }
                                  }}
                                  defaultValue=""
                                  style={{ minWidth: '120px' }}
                                  disabled={assigningAgent === orderId}
                                >
                                  <option value="">Change Agent</option>
                                  {agents
                                    .filter(agent => {
                                      const currentAgentId = (agent.agentId || agent.id).toString();
                                      return currentAgentId !== agentId.toString();
                                    })
                                    .map(agent => (
                                      <option key={agent.agentId || agent.id} value={agent.agentId || agent.id}>
                                        {agent.AgentName || agent.agentName || agent.name || `Agent ${agent.agentId || agent.id}`}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            ) : (
                              <select
                                className="form-select form-select-sm"
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleAssignAgent(orderId, e.target.value);
                                    // Reset dropdown after assignment
                                    e.target.value = "";
                                  }
                                }}
                                defaultValue=""
                                style={{ minWidth: '150px' }}
                                disabled={assigningAgent === orderId}
                              >
                                <option value="">{assigningAgent === orderId ? 'Assigning...' : 'Select Agent'}</option>
                                {agents.map(agent => (
                                  <option key={agent.agentId || agent.id} value={agent.agentId || agent.id}>
                                    {agent.AgentName || agent.agentName || agent.name || `Agent ${agent.agentId || agent.id}`}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Agents Tab */}
      {activeTab === 'agents' && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Delivery Agents</h5>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Agent ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent, index) => (
                    <tr key={agent.agentId}>
                      <td>{index + 1}</td>
                      <td>{agent.agentId}</td>
                      <td>{agent.agentName}</td>
                      <td>{agent.agentEmail}</td>
                      <td>{agent.agentPhone}</td>
                      <td>
                        <span className="badge bg-success">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-receipt me-2 text-danger"></i>
                  Order Details - #{selectedOrder.orderId || selectedOrder.id}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseOrderModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-danger">Order Information</h6>
                    <p><strong>Order ID:</strong> #{selectedOrder.orderId || selectedOrder.id}</p>
                    <p><strong>Customer:</strong> {getCustomerUsername(selectedOrder.customerId || selectedOrder.customer?.id || selectedOrder.customer)}</p>
                    <p><strong>Total Amount:</strong> ₹{selectedOrder.totalAmount || selectedOrder.totalprice || selectedOrder.totalPrice || selectedOrder.total || 0}</p>
                    <p><strong>Status:</strong>
                      <span className={`badge ${getStatusBadgeClass(selectedOrder.statusId || selectedOrder.status)} ms-2`}>
                        {getStatusDisplayText(selectedOrder.statusId || selectedOrder.status)}
                      </span>
                    </p>
                    <p><strong>Order Date:</strong> {new Date(selectedOrder.orderDate || selectedOrder.createdAt || new Date()).toLocaleDateString()}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-danger">Delivery Information</h6>
                    <p><strong>Agent:</strong> {getAgentName(selectedOrder.agentId || selectedOrder.deliveryAgent?.id, selectedOrder)}</p>
                    <p><strong>Address:</strong> {selectedOrder.address || selectedOrder.deliveryAddress || 'Not provided'}</p>
                    <p><strong>Phone:</strong> {selectedOrder.phone || selectedOrder.customerPhone || 'Not provided'}</p>
                  </div>
                </div>

                {selectedOrder.products && selectedOrder.products.length > 0 && (
                  <div className="mt-4">
                    <h6 className="text-danger">Order Items</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.products.map((item, index) => (
                            <tr key={index}>
                              <td>{item.productName || item.name || 'Unknown Product'}</td>
                              <td>{item.quantity || 1}</td>
                              <td>₹{item.price || item.productPrice || 0}</td>
                              <td>₹{(item.quantity || 1) * (item.price || item.productPrice || 0)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseOrderModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

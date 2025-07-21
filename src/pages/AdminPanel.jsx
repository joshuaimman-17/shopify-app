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

    // If not found in order, look up in agents list
    if (agentId) {
      const agent = agents.find(a =>
        a.agentId === agentId ||
        a.id === agentId ||
        a.userId === agentId
      );

      console.log(`Looking for agent ${agentId}:`, agent);

      if (agent) {
        const name = agent.agentName || agent.name || agent.AgentName || agent.username || `Agent ${agentId}`;
        console.log(`Found agent name: ${name}`);
        return name;
      }

      // If agent ID exists but agent not found in list, show ID
      console.log(`Agent ${agentId} not found in agents list`);
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

    try {
      console.log('Assigning agent:', { orderId, agentId });
      const response = await assignAgentToOrder({
        orderId,
        agentId
      });

      console.log('Agent assignment response:', response);

      // Refresh orders to see the updated assignment
      await fetchOrders();

      // Also refresh agents in case their status changed
      await fetchAgents();

      alert('Agent assigned successfully!');
    } catch (error) {
      console.error('Failed to assign agent:', error);
      alert('Failed to assign agent: ' + (error.response?.data?.message || error.message));
    }
  };










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
                          <th>ID</th>
                          <th>Name</th>
                          <th>Price</th>
                          
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product.productId}>
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
                Orders Management
              </h5>
              <button
                className="btn btn-outline-danger"
                onClick={fetchOrders}
                disabled={loading}
              >
                <i className="fas fa-sync-alt me-2"></i>
                Refresh
              </button>
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
                    <h4>{orders.filter(o => (o.status || '').toLowerCase() === 'pending').length}</h4>
                    <small>Pending Orders</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body text-center">
                    <h4>{orders.filter(o => (o.status || '').toLowerCase() === 'delivered').length}</h4>
                    <small>Delivered Orders</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body text-center">
                    <h4>₹{orders.reduce((sum, o) => sum + (o.totalAmount || o.totalprice || o.totalPrice || o.total || 0), 0)}</h4>
                    <small>Total Revenue</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Agent</th>
                    <th>Assign Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
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
                            <p>No orders found</p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    orders.map((order, index) => {
                      // Handle different order data structures
                      const orderId = order.orderId || order.id || order.orderNumber || `ORDER-${index + 1}`;
                      const customerId = order.customerId || order.customer?.id || order.customer || 'Unknown';
                      const customerUsername = getCustomerUsername(customerId);
                      const totalPrice = order.totalAmount || order.totalprice || order.totalPrice || order.total || 0;
                      // Handle both old string format and new ID format for order status
                      const orderStatus = order.statusId || order.status || order.orderStatus || 1; // Default to PLACED (ID: 1)
                      const agentId = order.agentId || order.deliveryAgent?.id || order.agent?.id;
                      const agentName = getAgentName(agentId, order);

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
                          <td>
                            <strong>#{orderId}</strong>
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
                            <i className="fas fa-truck me-1"></i>
                            {agentName}
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              onChange={(e) => handleAssignAgent(orderId, e.target.value)}
                              value={agentId || ""}
                            >
                              <option value="">{agentId ? 'Change Agent' : 'Assign Agent'}</option>
                              {agents.map(agent => (
                                <option key={agent.agentId || agent.id} value={agent.agentId || agent.id}>
                                  {agent.AgentName || agent.agentName || agent.name || `Agent ${agent.agentId || agent.id}`}
                                </option>
                              ))}
                            </select>
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
                    <th>Agent ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map(agent => (
                    <tr key={agent.agentId}>
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
    </div>
  );
};

export default AdminPanel;

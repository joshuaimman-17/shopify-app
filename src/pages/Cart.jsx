import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../datastore/cartSlice';
import { placeOrder } from '../api/apicall.js';
import { useNavigate } from 'react-router-dom';
import { CartSkeleton, CheckoutFormSkeleton } from '../Components/SkeletonLoader';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cartinfo.items) || [];
  const user = useSelector((state) => state.userinfo.user);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderForm, setOrderForm] = useState({
    phone: '',
    address: ''
  });

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: productId, quantity: parseInt(newQuantity) }));
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleFormChange = (e) => {
    setOrderForm({
      ...orderForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user || cartItems.length === 0 || !orderForm.phone || !orderForm.address) return;

    setLoading(true);
    try {
      const orderData = {
        customerId: user.id,
        phone: orderForm.phone,
        address: orderForm.address,
        products: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      const res = await placeOrder(orderData);
      console.log('Order response:', res.data);

      // ✅ Flexible success check
      const message = typeof res.data === 'string' ? res.data : res.data?.message;
      if (message && message.toLowerCase().includes('success')) {
        setOrderPlaced(true);
        dispatch(clearCart());
        setTimeout(() => {
          navigate('/orders');
        }, 2000);
      } else {
        alert('Order could not be placed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error placing order:', error);

      let errorMessage = 'Failed to place order. ';

      if (error.message && error.message.includes('Unable to place order')) {
        errorMessage = error.message;
      } else if (error.response) {
        errorMessage += `Server error: ${error.response.status} - ${error.response.statusText}`;
        if (error.response.status === 404) {
          errorMessage += '\n\nThe order API endpoint was not found. Please ensure:';
          errorMessage += '\n• Backend server is running';
          errorMessage += '\n• Order API endpoints are properly configured';
          errorMessage += '\n• Database connection is working';
        } else if (error.response.status === 400) {
          errorMessage += '\n\nBad request. Please check the order data format.';
        } else if (error.response.status === 401) {
          errorMessage += '\n\nUnauthorized. Please log in again.';
        } else if (error.response.status === 500) {
          errorMessage += '\n\nServer internal error. Please try again later.';
        }
      } else if (error.request) {
        errorMessage += 'No response from server. Please check:';
        errorMessage += '\n• Internet connection';
        errorMessage += '\n• Backend server is running on correct port';
        errorMessage += '\n• CORS is properly configured';
      } else {
        errorMessage += error.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="alert alert-success">
            <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
            <h4>Order Placed Successfully!</h4>
            <p>Thank you for your order. You will be redirected to order history...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <i className="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
          <h2>Your Cart is Empty</h2>
          <p className="text-muted">Add some products to your cart to get started!</p>
          <button 
            className="btn btn-danger"
            onClick={() => navigate('/')}
          >
            <i className="fas fa-shopping-bag me-2"></i>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-danger text-white">
                <h4 className="mb-0">
                  <i className="fas fa-credit-card me-2"></i>
                  Checkout
                </h4>
              </div>
              <div className="card-body">
                <form onSubmit={handlePlaceOrder}>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      <i className="fas fa-phone me-2"></i>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={orderForm.phone}
                      onChange={handleFormChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      Delivery Address *
                    </label>
                    <textarea
                      className="form-control"
                      id="address"
                      name="address"
                      rows="3"
                      value={orderForm.address}
                      onChange={handleFormChange}
                      placeholder="Enter your complete delivery address"
                      required
                    ></textarea>
                  </div>

                  <div className="card mb-3">
                    <div className="card-header">
                      <h6 className="mb-0">Order Summary</h6>
                    </div>
                    <div className="card-body">
                      {cartItems.map(item => (
                        <div key={item.id} className="d-flex justify-content-between mb-2">
                          <span>{item.name} x {item.quantity}</span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <hr />
                      <div className="d-flex justify-content-between">
                        <strong>Total: ₹{getTotalPrice().toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button 
                      type="submit" 
                      className="btn btn-danger flex-grow-1"
                      disabled={loading || !orderForm.phone || !orderForm.address}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check me-2"></i>
                          Place Order
                        </>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowCheckout(false)}
                      disabled={loading}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Back to Cart
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Loading Overlay */}
      {loading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
             style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999 }}>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="spinner-border text-danger mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Processing...</span>
            </div>
            <h5>Processing Your Order...</h5>
            <p className="text-muted mb-0">Please wait while we place your order</p>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="fas fa-shopping-cart me-2 text-danger"></i>
              Shopping Cart
            </h2>
            <span className="badge bg-danger fs-6">{cartItems.length} items</span>
          </div>
          
          {cartItems.map(item => (
            <div key={item.id} className="card mb-3">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img 
                      src={item.imageUrl || '/placeholder-image.jpg'} 
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-4">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="text-muted">₹{item.price} each</p>
                  </div>
                  <div className="col-md-3">
                    <div className="input-group">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        className="form-control text-center"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        min="1"
                      />
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <p className="fw-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="col-md-1">
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove item"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="d-flex justify-content-between">
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/')}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Continue Shopping
            </button>
            <button 
              className="btn btn-outline-danger"
              onClick={handleClearCart}
            >
              <i className="fas fa-trash me-2"></i>
              Clear Cart
            </button>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card sticky-top">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-calculator me-2"></i>
                Order Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="text-danger">₹{getTotalPrice().toFixed(2)}</strong>
              </div>
              <button 
                className="btn btn-danger w-100"
                onClick={() => setShowCheckout(true)}
                disabled={!user}
              >
                <i className="fas fa-credit-card me-2"></i>
                Proceed to Checkout
              </button>
              {!user && (
                <p className="text-muted text-center mt-2 small">
                  Please login to place an order
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

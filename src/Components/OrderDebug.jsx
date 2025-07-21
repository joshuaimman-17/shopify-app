import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getOrdersOfCustomer, placeOrder } from '../api/apicall';

const OrderDebug = () => {
  const user = useSelector((state) => state.userinfo.user);
  const [debugInfo, setDebugInfo] = useState({});
  const [testOrderResult, setTestOrderResult] = useState(null);

  useEffect(() => {
    if (user) {
      updateDebugInfo();
    }
  }, [user]);

  const updateDebugInfo = async () => {
    const info = {
      userId: user?.id,
      userRole: user?.role,
      timestamp: new Date().toISOString(),
      storedOrders: localStorage.getItem('userOrders'),
      storedOrdersCount: JSON.parse(localStorage.getItem('userOrders') || '[]').length,
    };

    // Try to fetch orders from API
    try {
      const response = await getOrdersOfCustomer(user.id);
      info.apiOrdersResponse = response.data;
      info.apiOrdersCount = response.data?.length || 0;
      info.apiStatus = 'Success';
    } catch (error) {
      info.apiStatus = 'Failed';
      info.apiError = error.message;
      info.apiErrorStatus = error.response?.status;
    }

    setDebugInfo(info);
  };

  const testPlaceOrder = async () => {
    const testOrder = {
      customerId: user.id,
      phone: '1234567890',
      address: 'Test Address 123',
      products: [
        {
          productId: 1,
          quantity: 1,
          price: 299,
          name: 'Test Product',
          imageUrl: 'https://via.placeholder.com/150'
        }
      ]
    };

    try {
      const response = await placeOrder(testOrder);
      setTestOrderResult({
        success: true,
        response: response.data,
        status: response.status
      });
      // Refresh debug info after placing order
      setTimeout(updateDebugInfo, 1000);
    } catch (error) {
      setTestOrderResult({
        success: false,
        error: error.message,
        status: error.response?.status
      });
    }
  };

  const clearStoredOrders = () => {
    localStorage.removeItem('userOrders');
    localStorage.removeItem('mockOrders');
    updateDebugInfo();
    setTestOrderResult(null);
  };

  if (!user) {
    return (
      <div className="alert alert-warning">
        Please log in to use the order debug tool.
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5>🔧 Order System Debug Tool</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h6>Debug Information:</h6>
            <pre className="bg-light p-3 small">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          <div className="col-md-6">
            <h6>Actions:</h6>
            <div className="d-grid gap-2">
              <button 
                className="btn btn-primary"
                onClick={updateDebugInfo}
              >
                🔄 Refresh Debug Info
              </button>
              <button 
                className="btn btn-success"
                onClick={testPlaceOrder}
              >
                🧪 Test Place Order
              </button>
              <button 
                className="btn btn-warning"
                onClick={clearStoredOrders}
              >
                🗑️ Clear Stored Orders
              </button>
            </div>
            
            {testOrderResult && (
              <div className={`alert mt-3 ${testOrderResult.success ? 'alert-success' : 'alert-danger'}`}>
                <h6>Test Order Result:</h6>
                <pre className="small">
                  {JSON.stringify(testOrderResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
        
        <hr />
        
        <div className="alert alert-info">
          <h6>How to Fix Order Issues:</h6>
          <ol>
            <li><strong>Backend Not Running:</strong> Start your backend server on the correct port</li>
            <li><strong>API Endpoints Missing:</strong> Check if order endpoints exist in your backend</li>
            <li><strong>CORS Issues:</strong> Ensure CORS is configured for your frontend domain</li>
            <li><strong>Database Issues:</strong> Check if your database is connected and tables exist</li>
            <li><strong>Authentication:</strong> Verify JWT tokens are being sent correctly</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default OrderDebug;

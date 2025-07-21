import { useState, useEffect } from 'react';
import { getAllProducts } from '../api/apicall.js';
import ProductCard from '../Components/Productcard.jsx';
import { ProductGridSkeleton, LoadingSpinner } from '../Components/SkeletonLoader.jsx';
import { FaSearch } from 'react-icons/fa';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllProducts();

      if (response.data && response.data.length > 0) {
        setProducts(response.data);
      } else {
        setProducts([]);
        setError('No products available at the moment');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);

      if (error.response?.status === 404) {
        setError('Product service is not available. Please check if the backend server is running.');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('Unable to connect to the server. Please check your internet connection and ensure the backend server is running.');
      } else {
        setError('Failed to load products. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const name = product.ProductName || product.productName || '';
    const description = product.ProductDescription || product.productDescription || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="container mt-4">
        {/* Hero Section Skeleton */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="bg-light p-5 rounded text-center">
              <div className="skeleton-text title mx-auto mb-3" style={{ height: '48px', width: '60%' }}></div>
              <div className="skeleton-text description mx-auto" style={{ height: '24px', width: '40%' }}></div>
            </div>
          </div>
        </div>

        {/* Search Section Skeleton */}
        <div className="row mb-4">
          <div className="col-md-6 mx-auto">
            <div className="skeleton-button" style={{ height: '38px', width: '100%' }}></div>
          </div>
        </div>

        {/* Products Section Skeleton */}
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="skeleton-text title" style={{ height: '32px', width: '200px' }}></div>
              <div className="skeleton-text" style={{ height: '24px', width: '100px' }}></div>
            </div>
            <ProductGridSkeleton count={8} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="bg-danger text-white p-5 rounded text-center">
            <h1 className="display-4 mb-3">Welcome to MyShopifyApp</h1>
            <p className="lead">Discover amazing products at great prices</p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="row mb-4">
        <div className="col-md-6 mx-auto">
          <div className="input-group">
            <span className="input-group-text bg-danger text-white">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className={`alert ${error.includes('sample') ? 'alert-warning' : 'alert-danger'}`}>
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
              {!error.includes('sample') && (
                <button 
                  className="btn btn-sm btn-outline-danger ms-3"
                  onClick={fetchProducts}
                >
                  <i className="fas fa-sync-alt me-1"></i>
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              <i className="fas fa-shopping-bag me-2 text-danger"></i>
              All Products
            </h2>
           
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-search fa-5x text-muted mb-3"></i>
              <h4>No products found</h4>
              <p className="text-muted">
                {searchTerm ? 'Try adjusting your search terms' : 'No products available at the moment'}
              </p>
              {searchTerm && (
                <button 
                  className="btn btn-danger"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="fas fa-times me-2"></i>
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="row">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.productId || product.id} 
                  product={product} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="row mt-5 mb-4">
        <div className="col-12">
          <hr />
          <h3 className="text-center mb-4">Why Choose Us?</h3>
        </div>
        <div className="col-md-4 text-center mb-3">
          <i className="fas fa-shipping-fast fa-3x text-danger mb-3"></i>
          <h5>Fast Delivery</h5>
          <p className="text-muted">Quick and reliable delivery to your doorstep</p>
        </div>
        <div className="col-md-4 text-center mb-3">
          <i className="fas fa-shield-alt fa-3x text-danger mb-3"></i>
          <h5>Secure Shopping</h5>
          <p className="text-muted">Your data and payments are always protected</p>
        </div>
        <div className="col-md-4 text-center mb-3">
          <i className="fas fa-headset fa-3x text-danger mb-3"></i>
          <h5>24/7 Support</h5>
          <p className="text-muted">We're here to help whenever you need us</p>
        </div>
      </div>
    </div>
  );
};

export default Home;

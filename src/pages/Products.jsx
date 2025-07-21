import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../api/apicall.js';
import ProductCard from '../Components/Productcard.jsx';
import { ProductGridSkeleton } from '../Components/SkeletonLoader.jsx';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="skeleton-text title mb-4" style={{ height: '32px', width: '250px' }}></div>
        <ProductGridSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        <i className="fas fa-box-open me-2 text-danger"></i>
        Related Products
      </h2>

      {error && (
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {products.length === 0 && !error ? (
        <div className="text-center py-5">
          <i className="fas fa-box fa-5x text-muted mb-3"></i>
          <h4>No products available</h4>
          <p className="text-muted">Check back later for new products!</p>
        </div>
      ) : (
        <div className="row">
          {products.map(product => (
            <ProductCard key={product.productId || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

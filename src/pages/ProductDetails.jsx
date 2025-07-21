import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProductById } from '../api/apicall';
import { addToCart } from '../datastore/cartSlice';
import { ProductDetailsSkeleton } from '../Components/SkeletonLoader';
import Products from './Products';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        setError('Failed to load product details');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product.id || product.productId,
        name: product.ProductName || product.productName,
        price: product.ProductPrice || product.productPrice,
        imageUrl: product.ProductimageUrl || product.productImageUrl,
        quantity: 1
      }));
      alert("product added ")
    }
  };

  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          Product not found
        </div>
      </div>
    );
  }

  const name = product.ProductName || product.productName;
  const price = product.ProductPrice || product.productPrice;
  const description = product.ProductDescription || product.productDescription;
  const imageUrl = product.ProductimageUrl || product.productImageUrl;

  return (
    <>
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img 
            src={imageUrl} 
            className="img-fluid rounded" 
            alt={name}
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6">
          <h1 className="mb-3">{name}</h1>
          <p className="text-muted mb-4">{description}</p>
          <div className="mb-4">
            <span className="h3 text-danger">₹{price}</span>
          </div>
          <button 
            className="btn btn-danger btn-lg"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    <Products/>
    </>
  );
};

export default ProductDetails;

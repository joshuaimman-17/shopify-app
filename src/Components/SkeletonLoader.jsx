import React from 'react';

// Product Card Skeleton
export const ProductCardSkeleton = () => {
  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm skeleton-card">
        <div className="skeleton-image"></div>
        <div className="card-body d-flex flex-column">
          <div className="skeleton-text title mb-2"></div>
          <div className="skeleton-text description mb-1"></div>
          <div className="skeleton-text description mb-3" style={{ width: '70%' }}></div>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="skeleton-text price"></div>
            </div>
            <div className="d-flex gap-2">
              <div className="skeleton-button flex-grow-1"></div>
              <div className="skeleton-button" style={{ width: '45px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="row">
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Product Details Skeleton
export const ProductDetailsSkeleton = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <div 
            className="skeleton-image rounded" 
            style={{ height: '500px', width: '100%' }}
          ></div>
        </div>
        <div className="col-md-6">
          <div className="skeleton-text title mb-3" style={{ height: '32px', width: '80%' }}></div>
          <div className="skeleton-text description mb-2"></div>
          <div className="skeleton-text description mb-2" style={{ width: '90%' }}></div>
          <div className="skeleton-text description mb-4" style={{ width: '60%' }}></div>
          <div className="skeleton-text price mb-4" style={{ height: '28px', width: '40%' }}></div>
          <div className="skeleton-button" style={{ height: '48px', width: '150px' }}></div>
        </div>
      </div>
    </div>
  );
};

// Order Card Skeleton
export const OrderCardSkeleton = () => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <div className="skeleton-text title mb-2" style={{ width: '120px' }}></div>
            <div className="skeleton-text description" style={{ width: '180px' }}></div>
          </div>
          <div className="skeleton-text" style={{ width: '80px', height: '24px' }}></div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <div className="skeleton-image" style={{ height: '80px' }}></div>
          </div>
          <div className="col-md-9">
            <div className="skeleton-text title mb-2"></div>
            <div className="skeleton-text description mb-2"></div>
            <div className="skeleton-text price" style={{ width: '100px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order History Skeleton
export const OrderHistorySkeleton = ({ count = 3 }) => {
  return (
    <div>
      {Array.from({ length: count }, (_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Profile Form Skeleton
export const ProfileFormSkeleton = () => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="skeleton-text title mb-4" style={{ height: '28px', width: '200px' }}></div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="skeleton-text mb-2" style={{ height: '16px', width: '80px' }}></div>
            <div className="skeleton-button" style={{ height: '38px', width: '100%' }}></div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="skeleton-text mb-2" style={{ height: '16px', width: '80px' }}></div>
            <div className="skeleton-button" style={{ height: '38px', width: '100%' }}></div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="skeleton-text mb-2" style={{ height: '16px', width: '80px' }}></div>
            <div className="skeleton-button" style={{ height: '38px', width: '100%' }}></div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="skeleton-text mb-2" style={{ height: '16px', width: '80px' }}></div>
            <div className="skeleton-button" style={{ height: '38px', width: '100%' }}></div>
          </div>
        </div>
        <div className="skeleton-button mt-3" style={{ height: '42px', width: '120px' }}></div>
      </div>
    </div>
  );
};

// Cart Item Skeleton
export const CartItemSkeleton = () => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-2">
            <div className="skeleton-image" style={{ height: '80px', width: '80px' }}></div>
          </div>
          <div className="col-md-4">
            <div className="skeleton-text title mb-2" style={{ width: '80%' }}></div>
            <div className="skeleton-text price" style={{ width: '60%' }}></div>
          </div>
          <div className="col-md-3">
            <div className="skeleton-button" style={{ height: '38px', width: '120px' }}></div>
          </div>
          <div className="col-md-2">
            <div className="skeleton-text price text-end" style={{ width: '80%' }}></div>
          </div>
          <div className="col-md-1">
            <div className="skeleton-button" style={{ height: '32px', width: '32px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Page Skeleton
export const CartSkeleton = ({ itemCount = 3 }) => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="skeleton-text title mb-4" style={{ height: '32px', width: '200px' }}></div>
          {Array.from({ length: itemCount }, (_, index) => (
            <CartItemSkeleton key={index} />
          ))}
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <div className="skeleton-text title" style={{ height: '24px', width: '150px' }}></div>
            </div>
            <div className="card-body">
              <div className="skeleton-text mb-3" style={{ height: '20px', width: '100%' }}></div>
              <div className="skeleton-text mb-3" style={{ height: '20px', width: '80%' }}></div>
              <div className="skeleton-text mb-4" style={{ height: '24px', width: '60%' }}></div>
              <div className="skeleton-button" style={{ height: '48px', width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Checkout Form Skeleton
export const CheckoutFormSkeleton = () => {
  return (
    <div className="card mt-4">
      <div className="card-header">
        <div className="skeleton-text title" style={{ height: '24px', width: '180px' }}></div>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <div className="skeleton-text mb-2" style={{ height: '16px', width: '100px' }}></div>
          <div className="skeleton-button" style={{ height: '38px', width: '100%' }}></div>
        </div>
        <div className="mb-3">
          <div className="skeleton-text mb-2" style={{ height: '16px', width: '80px' }}></div>
          <div className="skeleton-button" style={{ height: '76px', width: '100%' }}></div>
        </div>
        <div className="d-flex gap-2">
          <div className="skeleton-button flex-grow-1" style={{ height: '42px' }}></div>
          <div className="skeleton-button" style={{ height: '42px', width: '100px' }}></div>
        </div>
      </div>
    </div>
  );
};

// Generic Loading Component
export const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading-container">
      <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default {
  ProductCardSkeleton,
  ProductGridSkeleton,
  ProductDetailsSkeleton,
  OrderCardSkeleton,
  OrderHistorySkeleton,
  ProfileFormSkeleton,
  CartItemSkeleton,
  CartSkeleton,
  CheckoutFormSkeleton,
  LoadingSpinner
};

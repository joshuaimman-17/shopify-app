import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../datastore/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userinfo.user);
  const navigate = useNavigate();

  // Create a simple SVG placeholder that works offline
  const createPlaceholderSVG = () => {
    const svg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#e9ecef"/>
        <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="18" fill="#6c757d" text-anchor="middle">No Image</text>
        <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="14" fill="#6c757d" text-anchor="middle">Available</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Handle different property name formats from API
  const name = product.ProductName || product.productName || product.name;
  const price = product.ProductPrice || product.productPrice || product.price;
  const description = product.ProductDescription || product.productDescription || product.description;
  const imageUrl = product.productimageUrl || product.ProductimageUrl || product.productImageUrl || product.imageUrl || product.image;
  const productId = product.ProductId || product.productId || product.id;

  // Debug logging for image URL issues
  if (!imageUrl) {
    console.log('No image URL found for product:', {
      productId,
      name,
      availableFields: Object.keys(product),
      product
    });
  }

  const handleAddToCart = () => {
    if (user) {
      dispatch(addToCart({
        id: productId,
        name: name,
        price: price,
        imageUrl: imageUrl,
        quantity: 1
      }));
      alert("Product added to cart!");
    }
  };

  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm product-card">
        <Link to={`/product/${productId}`} className="text-decoration-none">
          <img
            src={imageUrl || createPlaceholderSVG()}
            className="card-img-top"
            alt={name || 'Product Image'}
            style={{ height: '200px', objectFit: 'cover' }}
            onError={(e) => {
              // Fallback to a simple colored div if even the SVG fails
              e.target.style.display = 'none';
              const placeholder = document.createElement('div');
              placeholder.style.cssText = 'height: 200px; background: #e9ecef; display: flex; align-items: center; justify-content: center; color: #6c757d; font-family: Arial, sans-serif; border-radius: 0.375rem 0.375rem 0 0;';
              placeholder.innerHTML = '<div style="text-align: center;"><i class="fas fa-image" style="font-size: 2rem; margin-bottom: 0.5rem;"></i><br>No Image Available</div>';
              e.target.parentNode.insertBefore(placeholder, e.target);
            }}
            loading="lazy"
          />
        </Link>
        <div className="card-body d-flex flex-column">
          <Link to={`/product/${productId}`} className="text-decoration-none">
            <h5 className="card-title text-dark">{name}</h5>
            <br/>
             <p className="card-text text-muted small">{description}</p>
          </Link>
         
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Link to={`/product/${productId}`} className="text-decoration-none">
              <span className="h5 text-danger mb-0">₹{price}</span>
                 </Link>
            </div>
            <div className="d-flex gap-2">
              <Link
                to={`/product/${productId}`}
                className="btn btn-outline-danger flex-grow-1"
              >
                View Details
              </Link>
              {user && (
                <button
                  className="btn btn-danger"
                  onClick={handleAddToCart}
                  title="Add to Cart"
                >
                  <i className="fas fa-cart-plus"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

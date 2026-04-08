import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const price    = product.salePrice || product.originalPrice
  const hasDiscount = product.salePrice && product.salePrice < product.originalPrice
  const discount = hasDiscount
    ? Math.round((1 - product.salePrice / product.originalPrice) * 100)
    : null

  const renderStars = (rating) => {
    const stars = Math.round(rating || 0)
    return '★'.repeat(stars) + '☆'.repeat(5 - stars)
  }

  return (
    <div className="product-card glass-card fade-in-up" id={`product-card-${product.id}`}>
      {/* Discount badge */}
      {discount && (
        <span className="product-discount-badge">-{discount}%</span>
      )}

      {/* Product Image */}
      <Link to={`/products/${product.slug}`} className="product-image-wrap">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.productName} className="product-image" />
        ) : (
          <div className="product-image-placeholder">
            <span>🛍️</span>
          </div>
        )}
        <div className="product-image-overlay">
          <span>View Details →</span>
        </div>
      </Link>

      {/* Content */}
      <div className="product-card-body">
        <p className="product-category-label">
          {product.productType || 'General'}
        </p>
        <Link to={`/products/${product.slug}`} className="product-name">
          {product.productName}
        </Link>

        {/* Rating */}
        {product.ratings > 0 && (
          <div className="rating">
            <span>{renderStars(product.ratings)}</span>
            <span className="rating-value">{product.ratings?.toFixed(1)}</span>
          </div>
        )}

        {/* Price */}
        <div className="product-price-row">
          {hasDiscount ? (
            <>
              <span className="price-sale">₹{product.salePrice?.toFixed(2)}</span>
              <span className="price-original">₹{product.originalPrice?.toFixed(2)}</span>
            </>
          ) : (
            <span className="price-current">₹{price?.toFixed(2)}</span>
          )}
        </div>

        {/* Stock indicator */}
        <div className="product-stock">
          {product.quantity > 0 ? (
            <span className="badge badge-success">In Stock ({product.quantity})</span>
          ) : (
            <span className="badge badge-danger">Out of Stock</span>
          )}
        </div>

        {/* Actions */}
        <div className="product-card-actions">
          <button
            id={`add-to-cart-${product.id}`}
            className="btn btn-primary"
            onClick={() => addItem(product.id, 1)}
            disabled={product.quantity === 0}
          >
            🛒 Add to Cart
          </button>
          <Link
            to={`/products/${product.slug}`}
            className="btn btn-secondary"
            id={`view-product-${product.id}`}
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}

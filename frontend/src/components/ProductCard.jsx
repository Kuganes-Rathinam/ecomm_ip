import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const price    = product.salePrice || product.originalPrice
  const hasDiscount = product.salePrice && product.salePrice < product.originalPrice

  const renderStars = (rating) => {
    const stars = Math.round(rating || 0)
    return '★'.repeat(stars) + '☆'.repeat(5 - stars)
  }

  return (
    <div className="product-card" id={`product-card-${product.id}`}>
      {/* Product Image */}
      <Link to={`/products/${product.slug}`} className="product-image-wrap">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.productName} className="product-image" />
        ) : (
          <div className="product-image-placeholder">No Image</div>
        )}
      </Link>

      {/* Content */}
      <div className="product-card-body">
        <Link to={`/products/${product.slug}`} className="product-name">
          {product.productName}
        </Link>
        
        {/* Rating */}
        {product.ratings > 0 && (
          <div className="product-rating">
            <span>{renderStars(product.ratings)}</span>
            <span className="rating-count">{Math.floor(Math.random() * 500) + 10}</span>
          </div>
        )}

        {/* Price */}
        <div className="product-price-row">
          <span className="price-symbol">₹</span>
          <span className="price-whole">{Math.floor(price)}</span>
          <span className="price-fraction">{(price % 1).toFixed(2).substring(2)}</span>
          {hasDiscount && (
            <span className="price-original">M.R.P: ₹{product.originalPrice?.toFixed(2)}</span>
          )}
        </div>

        {/* Delivery / Stock */}
        <div className="product-delivery">
          {product.quantity > 0 ? (
            <span className="in-stock">In stock</span>
          ) : (
            <span className="out-of-stock">Currently unavailable.</span>
          )}
        </div>

        {/* Actions */}
        <div className="product-card-actions">
          <button
            id={`add-to-cart-${product.id}`}
            className="btn btn-primary"
            onClick={() => addItem(product.id, 1)}
            disabled={product.quantity === 0}
            style={{ width: '100%', borderRadius: '20px' }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}

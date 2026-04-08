import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productApi, attributeApi, termApi } from '../api'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import './ProductDetail.css'

export default function ProductDetail() {
  const { slug }          = useParams()
  const navigate          = useNavigate()
  const { addItem }       = useCart()

  const [product,    setProduct]    = useState(null)
  const [attributes, setAttributes] = useState([])
  const [termMap,    setTermMap]    = useState({}) // attributeId → Term[]
  const [selected,   setSelected]   = useState({}) // attributeId → termId
  const [quantity,   setQuantity]   = useState(1)
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    productApi.getBySlug(slug)
      .then(async res => {
        setProduct(res.data)
        // Load attributes + their terms for variation selector
        const attrRes = await attributeApi.getAll()
        setAttributes(attrRes.data)
        const termResults = await Promise.all(
          attrRes.data.map(a => termApi.getByAttribute(a.id))
        )
        const map = {}
        attrRes.data.forEach((a, i) => { map[a.id] = termResults[i].data })
        setTermMap(map)
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = async () => {
    if (!product) return
    await addItem(product.id, quantity)
  }

  const price = product?.salePrice || product?.originalPrice
  const hasDiscount = product?.salePrice && product.salePrice < product.originalPrice

  const renderStars = (rating) => {
    const r = Math.round(rating || 0)
    return '★'.repeat(r) + '☆'.repeat(5 - r)
  }

  if (loading) return <div className="spinner-wrapper"><div className="spinner" /></div>
  if (!product) return (
    <div className="page-wrapper">
      <div className="container empty-state">
        <div className="empty-state-icon">😕</div>
        <h3 className="empty-state-title">Product Not Found</h3>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Catalog</button>
      </div>
    </div>
  )

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb fade-in-up">
          <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{product.productName}</span>
        </nav>

        <div className="product-detail-layout fade-in-up">
          {/* Image Panel */}
          <div className="product-detail-image-panel">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.productName} className="detail-image" />
            ) : (
              <div className="detail-image-placeholder">🛍️</div>
            )}
            {hasDiscount && (
              <span className="detail-discount-badge">
                -{Math.round((1 - product.salePrice / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Info Panel */}
          <div className="product-detail-info">
            <span className="detail-type-tag">{product.productType || 'General'}</span>
            <h1 className="detail-title">{product.productName}</h1>

            {/* Rating */}
            {product.ratings > 0 && (
              <div className="rating detail-rating">
                <span>{renderStars(product.ratings)}</span>
                <span className="rating-value">{product.ratings?.toFixed(1)} / 5.0</span>
              </div>
            )}

            {/* Price */}
            <div className="detail-price-row">
              {hasDiscount ? (
                <>
                  <span className="price-sale" style={{ fontSize: '2rem' }}>
                    ₹{product.salePrice?.toFixed(2)}
                  </span>
                  <span className="price-original" style={{ fontSize: '1.1rem' }}>
                    ₹{product.originalPrice?.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="price-current" style={{ fontSize: '2rem' }}>
                  ₹{price?.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="detail-description">{product.description}</p>
            )}

            <div className="divider" />

            {/* Attribute / Term Selectors */}
            {attributes.map(attr => {
              const terms = termMap[attr.id]
              if (!terms || terms.length === 0) return null
              return (
                <div key={attr.id} className="variation-group">
                  <label className="form-label">{attr.attributeName}</label>
                  <div className="term-chips">
                    {terms.map(term => (
                      <button
                        key={term.id}
                        id={`term-${term.id}`}
                        className={`term-chip ${selected[attr.id] === term.id ? 'selected' : ''}`}
                        onClick={() => setSelected(prev => ({ ...prev, [attr.id]: term.id }))}
                      >
                        {term.termName}
                        {term.price ? <span className="term-price">+₹{term.price}</span> : null}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Stock */}
            <div className="detail-stock">
              {product.quantity > 0 ? (
                <span className="badge badge-success">✓ In Stock — {product.quantity} units</span>
              ) : (
                <span className="badge badge-danger">✗ Out of Stock</span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="detail-actions">
              <div className="qty-stepper">
                <button
                  id="qty-decrease"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >−</button>
                <span>{quantity}</span>
                <button
                  id="qty-increase"
                  onClick={() => setQuantity(q => Math.min(product.quantity, q + 1))}
                >+</button>
              </div>

              <button
                id="add-to-cart-detail"
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                style={{ flex: 1 }}
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

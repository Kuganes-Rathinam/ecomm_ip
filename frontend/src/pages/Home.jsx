import { useState, useEffect } from 'react'
import { productApi, categoryApi } from '../api'
import ProductCard from '../components/ProductCard'
import './Home.css'

export default function Home() {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search,     setSearch]     = useState('')
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    Promise.all([
      categoryApi.getAll(),
      productApi.getAll({ status: 'active' }),
    ]).then(([catRes, prodRes]) => {
      setCategories(catRes.data)
      setProducts(prodRes.data)
    }).finally(() => setLoading(false))
  }, [])

  // Filter products client-side
  const filtered = products.filter(p => {
    const matchCat    = activeCategory === 'all' || p.categoryId === activeCategory
    const matchSearch = p.productName.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="page-wrapper home-page">
      <div className="container">

        {/* Hero Banner */}
        <section className="hero-banner fade-in-up">
          <div className="hero-content">
            <span className="hero-tag">🔥 New Arrivals</span>
            <h1 className="hero-title">
              Shop the Future,<br />
              <span className="gradient-text">Today.</span>
            </h1>
            <p className="hero-subtitle">
              Discover curated collections across all categories — premium quality at unbeatable prices.
            </p>
          </div>
          <div className="hero-glow" />
        </section>

        {/* Search Bar */}
        <div className="search-bar-wrap fade-in-up">
          <span className="search-icon">🔍</span>
          <input
            id="product-search"
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* Category Filter */}
        <div className="category-filters fade-in-up">
          <button
            id="filter-all"
            className={`category-chip ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Products
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              id={`filter-cat-${cat.id}`}
              className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <span className="section-subtitle">
            {loading ? 'Loading...' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
          </span>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="spinner-wrapper"><div className="spinner" /></div>
        ) : filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map((product, i) => (
              <div key={product.id} style={{ animationDelay: `${i * 50}ms` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🛍️</div>
            <h3 className="empty-state-title">No products found</h3>
            <p className="empty-state-desc">
              Try a different search term or category filter
            </p>
            <button className="btn btn-primary" onClick={() => { setSearch(''); setActiveCategory('all') }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

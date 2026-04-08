import { useState, useEffect } from 'react'
import { productApi, categoryApi } from '../api'
import ProductCard from '../components/ProductCard'
import { useLocation } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading,    setLoading]    = useState(true)

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('q') || ''

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
    const matchSearch = p.productName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="page-wrapper home-page">
      <div className="container">

        {/* Category Filter */}
        <div className="category-sidebar">
          <h3>Departments</h3>
          <ul className="category-list">
            <li>
              <button
                id="filter-all"
                className={activeCategory === 'all' ? 'active' : ''}
                onClick={() => setActiveCategory('all')}
              >
                All Products
              </button>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <button
                  id={`filter-cat-${cat.id}`}
                  className={activeCategory === cat.id ? 'active' : ''}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.categoryName}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="main-content">
          {/* Results Summary */}
          <div className="results-summary">
            <span>
              {loading ? 'Loading...' : `1-${filtered.length} of over ${filtered.length} results`}
              {searchQuery && <span> for <strong>"{searchQuery}"</strong></span>}
            </span>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="spinner-wrapper"><div className="spinner" /></div>
          ) : filtered.length > 0 ? (
            <div className="product-grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No results found</h3>
              <p>Try checking your spelling or use more general terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

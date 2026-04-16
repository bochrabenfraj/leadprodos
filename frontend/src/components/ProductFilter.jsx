import React, { useState, useEffect } from 'react';
import { getProductsByCategory, filterProductsByCategory } from '../services/api';
import '../styles/ProductFilter.css';

export default function ProductFilter() {
    const [groupedProducts, setGroupedProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load all categories on mount
    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            const response = await getProductsByCategory();
            setGroupedProducts(response.data);
            setError(null);
        } catch (err) {
            console.error('Error loading categories:', err);
            setError('Failed to load product categories');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = async (category) => {
        try {
            setSelectedCategory(category);
            setLoading(true);
            const response = await filterProductsByCategory(category);
            setFilteredProducts(response.data);
            setError(null);
        } catch (err) {
            console.error('Error filtering products:', err);
            setError(`Failed to filter products from ${category}`);
        } finally {
            setLoading(false);
        }
    };

    const handleShowAll = () => {
        setSelectedCategory(null);
        setFilteredProducts([]);
    };

    if (loading && !groupedProducts.length) {
        return <div className="loading">Loading products...</div>;
    }

    return (
        <div className="product-filter-container">
            <div className="filter-section">
                <h2>� Filter by Category</h2>
                <div className="category-dropdown-wrapper">
                    <select 
                        className="category-dropdown"
                        value={selectedCategory || ''}
                        onChange={(e) => {
                            if (e.target.value === '') {
                                handleShowAll();
                            } else {
                                handleCategoryClick(e.target.value);
                            }
                        }}
                    >
                        <option value="">📦 All Products ({groupedProducts.reduce((sum, g) => sum + g.count, 0)})</option>
                        {groupedProducts.map((group) => (
                            <option key={group.category} value={group.category}>
                                {group.category} ({group.count})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="products-section">
                {selectedCategory ? (
                    <>
                        <h3>📂 {selectedCategory}</h3>
                        {loading ? (
                            <div className="loading">Loading...</div>
                        ) : (
                            <div className="products-grid">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="product-card">
                                        <div className="product-header">
                                            <h4>{product.name}</h4>
                                            <span className="price">${product.price.toFixed(2)}</span>
                                        </div>
                                        <p className="description">{product.description}</p>
                                        <div className="product-footer">
                                            <span className="stock">Stock: {product.stock}</span>
                                            <button className="btn-add">Add to Cart</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <h3>📊 All Products by Category</h3>
                        {groupedProducts.map((group) => (
                            <div key={group.category} className="category-section">
                                <h4>{group.category} ({group.count})</h4>
                                <div className="products-grid">
                                    {group.products.map((product) => (
                                        <div key={product.id} className="product-card">
                                            <div className="product-header">
                                                <h5>{product.name}</h5>
                                                <span className="price">${product.price.toFixed(2)}</span>
                                            </div>
                                            <p className="description">{product.description}</p>
                                            <div className="product-footer">
                                                <span className="stock">Stock: {product.stock}</span>
                                                <button className="btn-add">Add to Cart</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

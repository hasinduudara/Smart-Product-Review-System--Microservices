import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

// TypeScript interfaces
interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}

interface Review {
    id: number;
    product_id: number;
    comment: string;
    sentiment: string;
}

function App() {
    // State variables
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    // Review related states
    const [activeProductId, setActiveProductId] = useState<number | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState('');

    // Fetch products on component mount
    const fetchProducts = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        loadProducts();
    }, []);

    // Add new product
    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/products', {
                name,
                price: parseFloat(price),
                description
            });
            setName(''); setPrice(''); setDescription('');
            fetchProducts();
            // alert("Product Added Successfully!"); // Removed alert for smoother UX
        } catch (error) {
            console.error("Error adding product", error);
        }
    };

    // See reviews for a product
    const handleViewReviews = async (productId: number) => {
        setActiveProductId(productId);
        try {
            const response = await axios.get(`http://localhost:5000/api/reviews/${productId}`);
            setReviews(response.data);
        } catch (error) {
            console.error("Error fetching reviews", error);
        }
    };

    // AI Check Review
    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeProductId) return;

        try {
            await axios.post('http://localhost:5000/api/reviews', {
                product_id: activeProductId,
                comment: newReview
            });
            setNewReview('');
            handleViewReviews(activeProductId); // Refresh list of reviews
        } catch (error) {
            console.error("Error adding review", error);
        }
    };

    return (
        <div className="container">
            <h1>🛒 Smart <span>Product System</span></h1>

            {/* --- add product section --- */}
            <div className="card">
                <h3>✨ Add New Product</h3>
                <form onSubmit={handleAddProduct} className="form-row">
                    <input 
                        placeholder="Product Name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        required 
                    />
                    <input 
                        placeholder="Price (Rs.)" 
                        type="number" 
                        value={price} 
                        onChange={e => setPrice(e.target.value)} 
                        required 
                        style={{flex: '0 0 150px'}} /* Makes price field smaller */
                    />
                    <input 
                        placeholder="Description" 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        required 
                        style={{flex: 2}}
                    />
                    <button type="submit">Add Product +</button>
                </form>
            </div>

            <div className="content-grid">
                {/* --- Product list --- */}
                <div className="product-list">
                    <h3>📦 Available Products</h3>
                    {products.length === 0 ? <p style={{textAlign:'center', color:'#888'}}>No products yet.</p> : null}
                    
                    {products.map(product => (
                        <div 
                            key={product.id} 
                            className={`product-item ${activeProductId === product.id ? 'active' : ''}`} 
                            onClick={() => handleViewReviews(product.id)}
                        >
                            <span className="price-tag">Rs. {product.price}</span>
                            <h4>{product.name}</h4>
                            <p>{product.description}</p>
                        </div>
                    ))}
                </div>

                {/* --- Reviews and AI Sentiment --- */}
                <div className="review-section">
                    {activeProductId ? (
                        <>
                            <h3>💬 Reviews & AI Analysis</h3>
                            
                            <div className="reviews-list">
                                {reviews.length === 0 ? <p className="placeholder-text">No reviews yet. Be the first!</p> : null}
                                {reviews.map((review, index) => (
                                    <div key={index} className={`review-card ${review.sentiment.toLowerCase()}`}>
                                        <div className="review-content">"{review.comment}"</div>
                                        <span className="sentiment-badge">{review.sentiment}</span>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleAddReview} className="review-form">
                                <input
                                    placeholder="Write a review (e.g., This is amazing!)"
                                    value={newReview}
                                    onChange={e => setNewReview(e.target.value)}
                                    required
                                />
                                <button type="submit">Post Review ↵</button>
                            </form>
                        </>
                    ) : (
                        <div className="placeholder-text">
                            <span style={{fontSize: '3rem'}}>👈</span>
                            Select a product from the list <br/> to see AI-powered reviews.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
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
            alert("Product Added Successfully!");
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
            <h1>🛒 Smart Product System</h1>

            {/* --- add product section --- */}
            <div className="card">
                <h3>Add New Product</h3>
                <form onSubmit={handleAddProduct} className="form-row">
                    <input placeholder="Product Name" value={name} onChange={e => setName(e.target.value)} required />
                    <input placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} required />
                    <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
                    <button type="submit">Add Product</button>
                </form>
            </div>

            <div className="content-grid">
                {/* --- Product list --- */}
                <div className="product-list">
                    <h3>Available Products</h3>
                    {products.map(product => (
                        <div key={product.id} className="product-item" onClick={() => handleViewReviews(product.id)}>
                            <h4>{product.name}</h4>
                            <p>Price: Rs. {product.price}</p>
                            <p className="desc">{product.description}</p>
                            <button onClick={() => handleViewReviews(product.id)}>View Reviews</button>
                        </div>
                    ))}
                </div>

                {/* --- Reviews and AI Sentiment --- */}
                <div className="review-section">
                    {activeProductId ? (
                        <>
                            <h3>Reviews for Product ID: {activeProductId}</h3>

                            <div className="reviews-list">
                                {reviews.length === 0 ? <p>No reviews yet.</p> : null}
                                {reviews.map((review, index) => (
                                    <div key={index} className={`review-card ${review.sentiment.toLowerCase()}`}>
                                        <p><strong>Comment:</strong> "{review.comment}"</p>
                                        <p><strong>AI Sentiment:</strong>
                                            <span className={`tag ${review.sentiment.toLowerCase()}`}>{review.sentiment}</span>
                                        </p>
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
                                <button type="submit">Submit Review</button>
                            </form>
                        </>
                    ) : (
                        <p className="placeholder-text">Select a product to see reviews and AI analysis.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
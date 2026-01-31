import express, { type Request, type Response } from 'express';
import axios from 'axios';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Path to the JSON file
const DATA_FILE = path.join(__dirname, 'reviews.json');

// --- DOCKER CONFIGURATION ---
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8080';
const SENTIMENT_SERVICE_URL = process.env.SENTIMENT_SERVICE_URL || 'http://localhost:5001';

// Middleware
app.use(cors());
app.use(express.json());

// Interface for Review
interface Review {
    id: number;
    product_id: number;
    comment: string;
    sentiment: string;
    date: Date;
}

// Interface for Sentiment Response
interface SentimentResponse {
    sentiment: string;
}

// --- Helper Functions ---

const loadReviews = (): Review[] => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error loading reviews:", error);
    }
    return [];
};

const saveReviews = (reviews: Review[]) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2));
    } catch (error) {
        console.error("Error saving reviews:", error);
    }
};

// --- ROUTES ---

// Product Routes
app.get('/api/products', async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/products`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error connecting to Product Service' });
    }
});

app.post('/api/products', async (req: Request, res: Response) => {
    try {
        const response = await axios.post(`${PRODUCT_SERVICE_URL}/products`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Error creating product' });
    }
});

// Review Routes
let reviews: Review[] = loadReviews();

app.post('/api/reviews', async (req: Request, res: Response) => {
    try {
        const { product_id, comment } = req.body;

        const sentimentResponse = await axios.post<SentimentResponse>(`${SENTIMENT_SERVICE_URL}/analyze`, {
            review: comment
        });

        const sentiment: string = sentimentResponse.data.sentiment;

        const newReview: Review = {
            id: reviews.length + 1,
            product_id,
            comment,
            sentiment,
            date: new Date()
        };

        reviews.push(newReview);
        saveReviews(reviews); // Save to file

        res.json(newReview);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing review' });
    }
});

app.get('/api/reviews/:productId', (req: Request, res: Response) => {
    const productIdParam = req.params.productId;
    const productId = parseInt(Array.isArray(productIdParam) ? productIdParam[0] ?? '0' : productIdParam ?? '0');
    
    const productReviews = reviews.filter(r => r.product_id === productId);
    res.json(productReviews);
});

// Server Start
app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
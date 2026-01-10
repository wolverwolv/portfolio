import 'dotenv/config';
import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoClient = new MongoClient(process.env.MONGODB_URI);
let db;

mongoClient.connect()
  .then(() => {
    console.log('API Server connected to MongoDB');
    db = mongoClient.db();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/reviews', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    const reviews = await db.collection('reviews').find().sort({ createdAt: -1 }).toArray();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Database not connected' });
    const projects = await db.collection('projects').find().sort({ createdAt: -1 }).toArray();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
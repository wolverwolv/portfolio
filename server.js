import 'dotenv/config';
import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import path from 'path';

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || "mongodb+srv://Wolverwolv:wolv71950f@minehavenutility.ldyo9.mongodb.net/?appName=MinehavenUtility";
const mongoClient = new MongoClient(mongoUri);
let db;

mongoClient.connect()
  .then(() => {
    console.log('API Server connected to MongoDB');
    db = mongoClient.db();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.get('/api/reviews', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'DB connecting...' });
    const reviews = await db.collection('reviews').find().sort({ createdAt: -1 }).toArray();
    res.json(reviews);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/projects', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'DB connecting...' });
    const projects = await db.collection('projects').find().sort({ createdAt: -1 }).toArray();
    res.json(projects);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Serve frontend dist files
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// Handle all other routes for SPA
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const PORT = process.env.PORT || 25649;
app.listen(PORT, () => console.log(`API Server running on port ${PORT}`));

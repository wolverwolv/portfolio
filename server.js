import 'dotenv/config';
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
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

// API Routes with Pagination and Lightweight Projection
app.get('/api/projects', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'DB connecting...' });
    const limit = parseInt(req.query._limit) || 0;
    const skip = parseInt(req.query._skip) || 0;

    // Optimization: Only return the FIRST image for the card list to save bandwidth
    let query = db.collection('projects').find({}, {
      projection: {
        title: 1,
        type: 1,
        description: 1,
        stats: 1,
        createdAt: 1,
        images: { $slice: 1 } // Only get the first image
      }
    }).sort({ createdAt: -1 });

    if (skip > 0) query = query.skip(skip);
    if (limit > 0) query = query.limit(limit);

    const projects = await query.toArray();
    res.json(projects);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// New route to get FULL details (all images) for a specific project
app.get('/api/projects/:id', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'DB connecting...' });
    const project = await db.collection('projects').findOne({ _id: new ObjectId(req.params.id) });
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/reviews', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'DB connecting...' });
    const limit = parseInt(req.query._limit) || 0;
    const skip = parseInt(req.query._skip) || 0;
    let query = db.collection('reviews').find().sort({ createdAt: -1 });
    if (skip > 0) query = query.skip(skip);
    if (limit > 0) query = query.limit(limit);
    const reviews = await query.toArray();
    res.json(reviews);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get(/.*/, (req, res) => res.sendFile(path.join(distPath, 'index.html')));

const PORT = process.env.PORT || 25649;
app.listen(PORT, () => console.log(`API Server running on port ${PORT}`));

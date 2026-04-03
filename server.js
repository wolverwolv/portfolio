import 'dotenv/config';
import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';

const app = express();
app.use(cors({
  origin: ['https://portfolio-wolverwolv.wasmer.app', 'http://localhost:5173', 'http://localhost:5000', 'https://wolvdoessstuf.onrender.com'],
  credentials: true
}));
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || "mongodb+srv://Wolverwolv:wolv71950f@minehavenutility.ldyo9.mongodb.net/?appName=MinehavenUtility";
const mongoClient = new MongoClient(mongoUri);
let db;

mongoClient.connect()
  .then(() => {
    console.log('API Server connected to MongoDB');
    db = mongoClient.db();
    // Start the background image downloader
    setInterval(downloadExternalImages, 1000 * 60 * 10); // Run every 10 minutes
    downloadExternalImages(); // Run once on start
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Function to download external images and save them locally
async function downloadExternalImages() {
  if (!db) return;
  try {
    // Process Projects
    const projects = await db.collection('projects').find().toArray();
    for (const project of projects) {
      if (!project.images || !Array.isArray(project.images)) continue;
      let updated = false;
      const newImages = [...project.images];
      for (let i = 0; i < newImages.length; i++) {
        const url = newImages[i];
        if (typeof url === 'string' && url.startsWith('http') && !url.includes('localhost') && !url.includes(process.env.APP_URL || '')) {
          const filename = await downloadFile(url, `project-${project._id}-${i}`);
          if (filename) {
            newImages[i] = `/uploads/${filename}`;
            updated = true;
          }
        }
      }
      if (updated) {
        await db.collection('projects').updateOne({ _id: project._id }, { $set: { images: newImages } });
      }
    }

    // Process Reviews
    const reviews = await db.collection('reviews').find().toArray();
    for (const review of reviews) {
      if (review.image && typeof review.image === 'string' && review.image.startsWith('http') && !review.image.includes('localhost') && !review.image.includes(process.env.APP_URL || '')) {
        const filename = await downloadFile(review.image, `review-${review._id}`);
        if (filename) {
          await db.collection('reviews').updateOne({ _id: review._id }, { $set: { image: `/uploads/${filename}` } });
        }
      }
    }
  } catch (err) {
    console.error('Error in background downloader:', err);
  }
}

async function downloadFile(url, prefix) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const contentType = response.headers.get('content-type');
    const extension = contentType ? contentType.split('/')[1] : 'png';
    const filename = `${prefix}.${extension}`;
    const filePath = path.join(uploadsDir, filename);
    const fileStream = fs.createWriteStream(filePath);
    await pipeline(response.body, fileStream);
    console.log(`Downloaded: ${filename}`);
    return filename;
  } catch (err) {
    console.error(`Download failed for ${url}:`, err.message);
    return null;
  }
}

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

// Serve uploads
app.use('/uploads', express.static(uploadsDir));

// Serve static files
app.use(express.static(path.join(process.cwd(), 'dist')));

// Handle all other routes
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

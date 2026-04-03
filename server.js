import 'dotenv/config';
import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream/promises';

const app = express();
app.use(cors({
  origin: ['https://portfolio-wolverwolv.wasmer.app', 'http://localhost:5173', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Connect to MongoDB
const mongoClient = new MongoClient(process.env.MONGODB_URI);
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

// Function to download external images (like from Discord) and save them locally
async function downloadExternalImages() {
  if (!db) return;
  try {
    const projects = await db.collection('projects').find().toArray();
    for (const project of projects) {
      if (!project.images || !Array.isArray(project.images)) continue;

      let updated = false;
      const newImages = [...project.images];

      for (let i = 0; i < newImages.length; i++) {
        const url = newImages[i];
        // If it's a Discord URL or other external URL, download it
        if (url.startsWith('http') && !url.includes(process.env.APP_URL || 'localhost')) {
          try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

            const contentType = response.headers.get('content-type');
            const extension = contentType ? contentType.split('/')[1] : 'png';
            const filename = `${project._id}-${i}.${extension}`;
            const filePath = path.join(uploadsDir, filename);

            const fileStream = fs.createWriteStream(filePath);
            await pipeline(response.body, fileStream);

            // Update the URL to point to our local uploads folder
            newImages[i] = `/uploads/${filename}`;
            updated = true;
            console.log(`Downloaded and saved: ${filename}`);
          } catch (err) {
            console.error(`Error downloading image ${url}:`, err.message);
          }
        }
      }

      if (updated) {
        await db.collection('projects').updateOne(
          { _id: project._id },
          { $set: { images: newImages } }
        );
      }
    }
  } catch (err) {
    console.error('Error in background downloader:', err);
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

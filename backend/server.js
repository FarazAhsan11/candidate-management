import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import CandidateRoutes from './routes/CandidateRoutes.js';
import cors from 'cors';
import fs from 'fs';

dotenv.config();
connectDB();

const tempDir = './public/temp';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const app = express();

app.use(cors({
  origin: ['https://candidate-management-sepia.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', CandidateRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));

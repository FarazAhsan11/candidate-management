import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import CandidateRoutes from './routes/CandidateRoutes.js';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', CandidateRoutes
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));

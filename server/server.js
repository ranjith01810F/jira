import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import jiraController from './controllers/jiraController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ 
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Mount the jiraController at the correct paths
app.use('/api', jiraController);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import uploadRouter from './routes/upload.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log("Connected to MongoDB!");
}).catch((err) => {
  console.log(err);
});

const app = express();

app.use(cors());
app.use(express.json())

app.use('/candidates', uploadRouter);

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

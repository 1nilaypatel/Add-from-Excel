import express from 'express';
import { getCandidates, handleUpload, uploadCandidates } from '../controllers/upload.controller.js';

const router = express.Router();

router.post('/upload', handleUpload, uploadCandidates);
router.get('/get', getCandidates);

export default router;
import express from 'express';
import { getAllCandidates, addCandidate, updateCandidateData, deleteCandidate, getCandidateById } from '../controllers/CandidateController.js';
import { upload } from '../middleware/multer.js';
const router = express.Router();

router.get('/candidates', getAllCandidates);
router.get('/candidates/:id', getCandidateById)
router.post('/candidates', upload.single("resume") ,addCandidate);
router.patch('/candidates/:id',upload.single("resume"),updateCandidateData);
router.delete('/candidates/:id', deleteCandidate)
export default router;
import express from 'express';
import {
  createFeedback,
  getMyFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} from '../controllers/feedbackController.js';
import { protect } from '../middlewares/auth.js';
import { validateFeedback } from '../middlewares/validation.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', validateFeedback, createFeedback);
router.get('/my-feedback', getMyFeedback);
router.get('/:id', getFeedbackById);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

export default router;

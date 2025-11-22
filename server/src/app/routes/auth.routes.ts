import express from 'express'
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';
import { login, signup, forgotPassword } from '../controllers/auth.controller';


const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

export default router;


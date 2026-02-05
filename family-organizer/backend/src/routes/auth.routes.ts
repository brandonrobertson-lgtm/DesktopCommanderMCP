import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Local auth
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

// OAuth routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);
router.get('/microsoft', authController.microsoftAuth);
router.get('/microsoft/callback', authController.microsoftCallback);
router.get('/apple', authController.appleAuth);
router.get('/apple/callback', authController.appleCallback);

// User profile
router.get('/me', authenticate, authController.getProfile);
router.patch('/me', authenticate, authController.updateProfile);
router.post('/change-password', authenticate, authController.changePassword);

// Family management
router.post('/family', authenticate, authController.createFamily);
router.post('/family/invite', authenticate, authController.inviteToFamily);
router.post('/family/join/:inviteToken', authenticate, authController.joinFamily);

export default router;

import { Router } from 'express';
import { EmailController } from '../controllers/emailController';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new EmailController();

router.use(authenticate);

// Email accounts
router.get('/accounts', controller.getAccounts);
router.post('/accounts/connect/gmail', controller.connectGmail);
router.post('/accounts/connect/microsoft', controller.connectMicrosoft);
router.post('/accounts/connect/icloud', controller.connectICloud);
router.delete('/accounts/:id', controller.disconnectAccount);

// Emails
router.get('/', controller.getEmails);
router.get('/:id', controller.getEmail);
router.post('/send', controller.sendEmail);
router.patch('/:id/read', controller.markAsRead);
router.patch('/:id/star', controller.toggleStar);
router.delete('/:id', controller.deleteEmail);

// Folders
router.get('/folders', controller.getFolders);
router.post('/sync', controller.syncEmails);

export default router;

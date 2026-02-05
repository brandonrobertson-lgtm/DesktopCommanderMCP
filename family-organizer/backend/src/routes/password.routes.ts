import { Router } from 'express';
import { PasswordController } from '../controllers/passwordController';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new PasswordController();

router.use(authenticate);

router.get('/', controller.getPasswords);
router.get('/:id', controller.getPassword);
router.post('/', controller.createPassword);
router.patch('/:id', controller.updatePassword);
router.delete('/:id', controller.deletePassword);
router.get('/folders', controller.getFolders);
router.post('/folders', controller.createFolder);
router.post('/sync/apple', controller.syncAppleKeychain);
router.post('/sync/google', controller.syncGooglePasswords);
router.post('/sync/onedrive', controller.syncOneDrive);

export default router;

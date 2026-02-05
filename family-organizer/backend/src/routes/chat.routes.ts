import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new ChatController();

router.use(authenticate);

router.get('/', controller.getMessages);
router.post('/', upload.single('attachment'), controller.sendMessage);
router.patch('/:id', controller.editMessage);
router.delete('/:id', controller.deleteMessage);

export default router;

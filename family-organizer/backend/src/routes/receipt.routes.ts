import { Router } from 'express';
import { ReceiptController } from '../controllers/receiptController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new ReceiptController();

router.use(authenticate);

router.get('/', controller.getReceipts);
router.get('/:id', controller.getReceipt);
router.post('/', upload.single('image'), controller.uploadReceipt);
router.patch('/:id', controller.updateReceipt);
router.delete('/:id', controller.deleteReceipt);
router.get('/category/:category', controller.getReceiptsByCategory);

export default router;

import { Router } from 'express';
import { FridgeController } from '../controllers/fridgeController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new FridgeController();

router.use(authenticate);

router.get('/', controller.getItems);
router.get('/:id', controller.getItem);
router.post('/', upload.single('image'), controller.createItem);
router.patch('/:id', controller.updateItem);
router.delete('/:id', controller.deleteItem);
router.get('/expiring/soon', controller.getExpiringSoon);
router.get('/location/:location', controller.getItemsByLocation);

export default router;

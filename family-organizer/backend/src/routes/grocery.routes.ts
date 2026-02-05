import { Router } from 'express';
import { GroceryController } from '../controllers/groceryController';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new GroceryController();

router.use(authenticate);

router.get('/', controller.getLists);
router.get('/:id', controller.getList);
router.post('/', controller.createList);
router.patch('/:id', controller.updateList);
router.delete('/:id', controller.deleteList);
router.post('/:id/items', controller.createItem);
router.patch('/items/:itemId', controller.updateItem);
router.delete('/items/:itemId', controller.deleteItem);
router.post('/items/:itemId/check', controller.toggleCheck);

export default router;

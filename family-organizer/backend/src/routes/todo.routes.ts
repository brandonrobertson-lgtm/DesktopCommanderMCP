import { Router } from 'express';
import { TodoController } from '../controllers/todoController';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new TodoController();

router.use(authenticate);

router.get('/', controller.getLists);
router.get('/:id', controller.getList);
router.post('/', controller.createList);
router.patch('/:id', controller.updateList);
router.delete('/:id', controller.deleteList);
router.post('/:id/items', controller.createItem);
router.patch('/items/:itemId', controller.updateItem);
router.delete('/items/:itemId', controller.deleteItem);
router.post('/items/:itemId/complete', controller.toggleComplete);

export default router;

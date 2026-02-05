import { Router } from 'express';
import { ContactController } from '../controllers/contactController';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new ContactController();

router.use(authenticate);

router.get('/', controller.getContacts);
router.get('/:id', controller.getContact);
router.post('/', controller.createContact);
router.patch('/:id', controller.updateContact);
router.delete('/:id', controller.deleteContact);
router.get('/category/:category', controller.getContactsByCategory);

export default router;

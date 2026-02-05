import { Router } from 'express';
import { NoteController } from '../controllers/noteController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new NoteController();

router.use(authenticate);

router.get('/', controller.getNotes);
router.get('/:id', controller.getNote);
router.post('/', upload.array('attachments', 5), controller.createNote);
router.patch('/:id', controller.updateNote);
router.delete('/:id', controller.deleteNote);
router.post('/:id/pin', controller.togglePin);
router.get('/folders', controller.getFolders);
router.post('/folders', controller.createFolder);

export default router;

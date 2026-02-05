import { Router } from 'express';
import { DocumentController } from '../controllers/documentController';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();
const controller = new DocumentController();

router.use(authenticate);

router.get('/', controller.getDocuments);
router.get('/:id', controller.getDocument);
router.post('/', upload.single('file'), controller.uploadDocument);
router.patch('/:id', controller.updateDocument);
router.delete('/:id', controller.deleteDocument);
router.get('/:id/download', controller.downloadDocument);
router.get('/folders', controller.getFolders);
router.post('/folders', controller.createFolder);

export default router;

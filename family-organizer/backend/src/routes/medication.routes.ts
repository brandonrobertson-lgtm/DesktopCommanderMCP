import { Router } from 'express';
import { MedicationController } from '../controllers/medicationController';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new MedicationController();

router.use(authenticate);

router.get('/', controller.getMedications);
router.get('/:id', controller.getMedication);
router.post('/', controller.createMedication);
router.patch('/:id', controller.updateMedication);
router.delete('/:id', controller.deleteMedication);
router.post('/:id/log', controller.logMedicationTaken);
router.get('/:id/logs', controller.getMedicationLogs);
router.get('/user/:userId', controller.getUserMedications);

export default router;

import { Router } from 'express';
import { HomeController } from '../controllers/homeController';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new HomeController();

router.use(authenticate);

router.get('/', controller.getHomes);
router.get('/:id', controller.getHome);
router.post('/', controller.createHome);
router.patch('/:id', controller.updateHome);
router.delete('/:id', controller.deleteHome);
router.get('/:id/appliances', controller.getAppliances);
router.post('/:id/appliances', controller.createAppliance);
router.patch('/appliances/:applianceId', controller.updateAppliance);
router.delete('/appliances/:applianceId', controller.deleteAppliance);
router.get('/appliances/:applianceId/maintenance', controller.getMaintenanceRecords);
router.post('/appliances/:applianceId/maintenance', controller.createMaintenanceRecord);

export default router;

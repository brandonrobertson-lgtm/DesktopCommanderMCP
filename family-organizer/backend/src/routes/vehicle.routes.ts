import { Router } from 'express';
import { VehicleController } from '../controllers/vehicleController';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new VehicleController();

router.use(authenticate);

// Vehicles
router.get('/', controller.getVehicles);
router.get('/:id', controller.getVehicle);
router.post('/', controller.createVehicle);
router.patch('/:id', controller.updateVehicle);
router.delete('/:id', controller.deleteVehicle);

// Maintenance records
router.get('/:id/maintenance', controller.getMaintenanceRecords);
router.post('/:id/maintenance', controller.createMaintenanceRecord);
router.patch('/maintenance/:maintenanceId', controller.updateMaintenanceRecord);
router.delete('/maintenance/:maintenanceId', controller.deleteMaintenanceRecord);

// Maintenance schedules
router.get('/:id/schedules', controller.getMaintenanceSchedules);
router.post('/:id/schedules', controller.createMaintenanceSchedule);
router.patch('/schedules/:scheduleId', controller.updateMaintenanceSchedule);
router.delete('/schedules/:scheduleId', controller.deleteMaintenanceSchedule);

// Reminders
router.get('/:id/reminders', controller.getUpcomingReminders);

export default router;

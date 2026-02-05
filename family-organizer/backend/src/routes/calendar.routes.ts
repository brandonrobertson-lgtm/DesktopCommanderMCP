import { Router } from 'express';
import { CalendarController } from '../controllers/calendarController';

const router = Router();
const controller = new CalendarController();

// OAuth Authentication
router.get('/google/auth', controller.googleAuth);
router.get('/google/callback', controller.googleCallback);
router.get('/microsoft/auth', controller.microsoftAuth);
router.get('/microsoft/callback', controller.microsoftCallback);
router.post('/apple/connect', controller.appleConnect);

// Calendar Accounts
router.get('/accounts', controller.getAccounts);
router.delete('/accounts/:id', controller.deleteAccount);

// Sync
router.post('/accounts/:accountId/sync', controller.syncEvents);
router.post('/sync-all', controller.syncAllAccounts);

// Events
router.get('/events', controller.getEvents);
router.get('/events/:id', controller.getEvent);
router.post('/events', controller.createEvent);
router.put('/events/:id', controller.updateEvent);
router.delete('/events/:id', controller.deleteEvent);

export default router;

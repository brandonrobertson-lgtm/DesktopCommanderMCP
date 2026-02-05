import { Request, Response } from 'express';
import { GoogleCalendarService } from '../services/googleCalendarService';
import { MicrosoftCalendarService } from '../services/microsoftCalendarService';
import { AppleCalendarService } from '../services/appleCalendarService';
import prisma from '../database/prisma';

const googleService = new GoogleCalendarService();
const microsoftService = new MicrosoftCalendarService();
const appleService = new AppleCalendarService();

export class CalendarController {
  // ======== GOOGLE CALENDAR ========
  async googleAuth(req: Request, res: Response) {
    try {
      const userId = req.user?.id || req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID required' });
      }

      const authUrl = googleService.getAuthUrl(userId);
      res.json({ success: true, data: { authUrl } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async googleCallback(req: Request, res: Response) {
    try {
      const { code, state: userId } = req.query;
      if (!code || !userId) {
        return res.status(400).json({ success: false, error: 'Code and user ID required' });
      }

      const account = await googleService.handleCallback(code as string, userId as string);
      res.json({ success: true, data: account });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ======== MICROSOFT CALENDAR ========
  async microsoftAuth(req: Request, res: Response) {
    try {
      const userId = req.user?.id || req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ success: false, error: 'User ID required' });
      }

      const authUrl = microsoftService.getAuthUrl(userId);
      res.json({ success: true, data: { authUrl } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async microsoftCallback(req: Request, res: Response) {
    try {
      const { code, state: userId } = req.query;
      if (!code || !userId) {
        return res.status(400).json({ success: false, error: 'Code and user ID required' });
      }

      const account = await microsoftService.handleCallback(code as string, userId as string);
      res.json({ success: true, data: account });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ======== APPLE CALENDAR ========
  async appleConnect(req: Request, res: Response) {
    try {
      const userId = req.user?.id || req.body.userId;
      const { username, password } = req.body;

      if (!userId || !username || !password) {
        return res.status(400).json({ success: false, error: 'User ID, username, and password required' });
      }

      const account = await appleService.connect(userId, username, password);
      res.json({ success: true, data: account });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ======== CALENDAR ACCOUNTS ========
  async getAccounts(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const accounts = await prisma.calendarAccount.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      res.json({ success: true, data: accounts });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      await prisma.calendarAccount.delete({
        where: { id: req.params.id },
      });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ======== SYNC EVENTS ========
  async syncEvents(req: Request, res: Response) {
    try {
      const { accountId } = req.params;
      const userId = req.user?.id;

      const account = await prisma.calendarAccount.findUnique({
        where: { id: accountId },
      });

      if (!account) {
        return res.status(404).json({ success: false, error: 'Account not found' });
      }

      let count = 0;
      switch (account.provider) {
        case 'google':
          count = await googleService.syncEvents(accountId, userId);
          break;
        case 'microsoft':
          count = await microsoftService.syncEvents(accountId, userId);
          break;
        case 'apple':
          count = await appleService.syncEvents(accountId, userId);
          break;
      }

      res.json({ success: true, data: { synced: count } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async syncAllAccounts(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const accounts = await prisma.calendarAccount.findMany({
        where: { userId, active: true },
      });

      let totalSynced = 0;
      for (const account of accounts) {
        try {
          let count = 0;
          switch (account.provider) {
            case 'google':
              count = await googleService.syncEvents(account.id, userId);
              break;
            case 'microsoft':
              count = await microsoftService.syncEvents(account.id, userId);
              break;
            case 'apple':
              count = await appleService.syncEvents(account.id, userId);
              break;
          }
          totalSynced += count;
        } catch (error) {
          console.error(`Error syncing account ${account.id}:`, error);
        }
      }

      res.json({ success: true, data: { synced: totalSynced } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ======== EVENTS ========
  async getEvents(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { startDate, endDate } = req.query;

      const where: any = { userId };
      if (startDate || endDate) {
        where.startTime = {};
        if (startDate) where.startTime.gte = new Date(startDate as string);
        if (endDate) where.startTime.lte = new Date(endDate as string);
      }

      const events = await prisma.calendarEvent.findMany({
        where,
        include: { account: true },
        orderBy: { startTime: 'asc' },
      });

      res.json({ success: true, data: events });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getEvent(req: Request, res: Response) {
    try {
      const event = await prisma.calendarEvent.findUnique({
        where: { id: req.params.id },
        include: { account: true },
      });

      if (!event) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }

      res.json({ success: true, data: event });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { accountId, title, description, startTime, endTime, location, attendees } = req.body;

      const account = await prisma.calendarAccount.findUnique({
        where: { id: accountId },
      });

      if (!account) {
        return res.status(404).json({ success: false, error: 'Account not found' });
      }

      const eventData = {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        attendees: attendees || [],
      };

      let event;
      switch (account.provider) {
        case 'google':
          event = await googleService.createEvent(accountId, userId, eventData);
          break;
        case 'microsoft':
          event = await microsoftService.createEvent(accountId, userId, eventData);
          break;
        case 'apple':
          event = await appleService.createEvent(accountId, userId, eventData);
          break;
        default:
          return res.status(400).json({ success: false, error: 'Unknown provider' });
      }

      res.json({ success: true, data: event });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const { title, description, startTime, endTime, location } = req.body;
      const event = await prisma.calendarEvent.findUnique({
        where: { id: req.params.id },
        include: { account: true },
      });

      if (!event) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }

      const eventData = {
        title: title || event.title,
        description: description || event.description,
        startTime: startTime ? new Date(startTime) : event.startTime,
        endTime: endTime ? new Date(endTime) : event.endTime,
        location: location || event.location,
      };

      let updated;
      switch (event.account.provider) {
        case 'google':
          updated = await googleService.updateEvent(req.params.id, eventData);
          break;
        case 'microsoft':
          updated = await microsoftService.updateEvent(req.params.id, eventData);
          break;
        case 'apple':
          updated = await appleService.updateEvent(req.params.id, eventData);
          break;
        default:
          return res.status(400).json({ success: false, error: 'Unknown provider' });
      }

      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const event = await prisma.calendarEvent.findUnique({
        where: { id: req.params.id },
        include: { account: true },
      });

      if (!event) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }

      switch (event.account.provider) {
        case 'google':
          await googleService.deleteEvent(req.params.id);
          break;
        case 'microsoft':
          await microsoftService.deleteEvent(req.params.id);
          break;
        case 'apple':
          await appleService.deleteEvent(req.params.id);
          break;
        default:
          return res.status(400).json({ success: false, error: 'Unknown provider' });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

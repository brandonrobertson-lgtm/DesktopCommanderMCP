import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import prisma from '../database/prisma';

interface GoogleCalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class GoogleCalendarService {
  private oauth2Client: OAuth2Client;
  private config: GoogleCalendarConfig;

  constructor() {
    this.config = {
      clientId: process.env.GOOGLE_CALENDAR_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CALENDAR_CLIENT_SECRET || '',
      redirectUri: process.env.GOOGLE_CALENDAR_REDIRECT_URI || '',
    };

    this.oauth2Client = new google.auth.OAuth2(
      this.config.clientId,
      this.config.clientSecret,
      this.config.redirectUri
    );
  }

  getAuthUrl(userId: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: userId, // Pass userId to retrieve after callback
    });
  }

  async handleCallback(code: string, userId: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    // Get user's primary calendar
    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    const { data } = await calendar.calendarList.list();
    const primaryCalendar = data.items?.find(cal => cal.primary);

    // Store calendar account
    const account = await prisma.calendarAccount.create({
      data: {
        userId,
        provider: 'google',
        email: primaryCalendar?.id || '',
        accessToken: tokens.access_token || '',
        refreshToken: tokens.refresh_token || '',
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        calendarId: primaryCalendar?.id || '',
        active: true,
      },
    });

    return account;
  }

  private async getAuthClient(accountId: string) {
    const account = await prisma.calendarAccount.findUnique({
      where: { id: accountId },
    });

    if (!account || !account.accessToken) {
      throw new Error('Calendar account not found or not authenticated');
    }

    this.oauth2Client.setCredentials({
      access_token: account.accessToken,
      refresh_token: account.refreshToken || undefined,
      expiry_date: account.expiresAt?.getTime(),
    });

    return this.oauth2Client;
  }

  async syncEvents(accountId: string, userId: string) {
    const auth = await this.getAuthClient(accountId);
    const calendar = google.calendar({ version: 'v3', auth });
    const account = await prisma.calendarAccount.findUnique({ where: { id: accountId } });

    if (!account?.calendarId) throw new Error('Calendar ID not found');

    // Fetch events from Google Calendar
    const response = await calendar.events.list({
      calendarId: account.calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];

    // Sync to local database
    for (const event of events) {
      if (!event.id) continue;

      const existingEvent = await prisma.calendarEvent.findFirst({
        where: { accountId, externalId: event.id },
      });

      const eventData = {
        title: event.summary || 'Untitled',
        description: event.description || '',
        startTime: new Date(event.start?.dateTime || event.start?.date || ''),
        endTime: new Date(event.end?.dateTime || event.end?.date || ''),
        location: event.location || '',
        attendees: event.attendees?.map(a => a.email || '') || [],
        recurring: !!event.recurrence,
        recurrence: event.recurrence?.join(', ') || '',
        synced: true,
        syncedAt: new Date(),
      };

      if (existingEvent) {
        await prisma.calendarEvent.update({
          where: { id: existingEvent.id },
          data: eventData,
        });
      } else {
        await prisma.calendarEvent.create({
          data: {
            ...eventData,
            accountId,
            userId,
            externalId: event.id,
          },
        });
      }
    }

    return events.length;
  }

  async createEvent(accountId: string, userId: string, eventData: any) {
    const auth = await this.getAuthClient(accountId);
    const calendar = google.calendar({ version: 'v3', auth });
    const account = await prisma.calendarAccount.findUnique({ where: { id: accountId } });

    if (!account?.calendarId) throw new Error('Calendar ID not found');

    // Create event in Google Calendar
    const googleEvent = await calendar.events.insert({
      calendarId: account.calendarId,
      requestBody: {
        summary: eventData.title,
        description: eventData.description,
        location: eventData.location,
        start: {
          dateTime: eventData.startTime.toISOString(),
          timeZone: 'America/New_York',
        },
        end: {
          dateTime: eventData.endTime.toISOString(),
          timeZone: 'America/New_York',
        },
        attendees: eventData.attendees?.map((email: string) => ({ email })),
      },
    });

    // Save to local database
    const localEvent = await prisma.calendarEvent.create({
      data: {
        accountId,
        userId,
        externalId: googleEvent.data.id || '',
        title: eventData.title,
        description: eventData.description,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        location: eventData.location,
        attendees: eventData.attendees || [],
        synced: true,
        syncedAt: new Date(),
      },
    });

    return localEvent;
  }

  async updateEvent(eventId: string, eventData: any) {
    const event = await prisma.calendarEvent.findUnique({
      where: { id: eventId },
      include: { account: true },
    });

    if (!event || !event.externalId) throw new Error('Event not found');

    const auth = await this.getAuthClient(event.accountId);
    const calendar = google.calendar({ version: 'v3', auth });

    // Update in Google Calendar
    await calendar.events.update({
      calendarId: event.account.calendarId || '',
      eventId: event.externalId,
      requestBody: {
        summary: eventData.title,
        description: eventData.description,
        location: eventData.location,
        start: {
          dateTime: eventData.startTime.toISOString(),
        },
        end: {
          dateTime: eventData.endTime.toISOString(),
        },
      },
    });

    // Update local database
    const updated = await prisma.calendarEvent.update({
      where: { id: eventId },
      data: {
        title: eventData.title,
        description: eventData.description,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        location: eventData.location,
        syncedAt: new Date(),
      },
    });

    return updated;
  }

  async deleteEvent(eventId: string) {
    const event = await prisma.calendarEvent.findUnique({
      where: { id: eventId },
      include: { account: true },
    });

    if (!event || !event.externalId) throw new Error('Event not found');

    const auth = await this.getAuthClient(event.accountId);
    const calendar = google.calendar({ version: 'v3', auth });

    // Delete from Google Calendar
    await calendar.events.delete({
      calendarId: event.account.calendarId || '',
      eventId: event.externalId,
    });

    // Delete from local database
    await prisma.calendarEvent.delete({
      where: { id: eventId },
    });
  }
}

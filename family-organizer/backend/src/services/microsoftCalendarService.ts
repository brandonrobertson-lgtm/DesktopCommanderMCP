import { Client } from '@microsoft/microsoft-graph-client';
import prisma from '../database/prisma';

interface MicrosoftCalendarConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  tenantId: string;
}

export class MicrosoftCalendarService {
  private config: MicrosoftCalendarConfig;

  constructor() {
    this.config = {
      clientId: process.env.MICROSOFT_CALENDAR_CLIENT_ID || '',
      clientSecret: process.env.MICROSOFT_CALENDAR_CLIENT_SECRET || '',
      redirectUri: process.env.MICROSOFT_CALENDAR_REDIRECT_URI || '',
      tenantId: process.env.MICROSOFT_CALENDAR_TENANT_ID || 'common',
    };
  }

  getAuthUrl(userId: string): string {
    const scopes = ['Calendars.ReadWrite', 'User.Read'];
    const authUrl = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/authorize?` +
      `client_id=${this.config.clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(this.config.redirectUri)}` +
      `&response_mode=query` +
      `&scope=${encodeURIComponent(scopes.join(' '))}` +
      `&state=${userId}`;

    return authUrl;
  }

  async handleCallback(code: string, userId: string) {
    // Exchange code for tokens
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          code,
          redirect_uri: this.config.redirectUri,
          grant_type: 'authorization_code',
        }),
      }
    );

    const tokens = await tokenResponse.json();

    // Get user info
    const client = this.getClient(tokens.access_token);
    const user = await client.api('/me').get();

    // Store calendar account
    const account = await prisma.calendarAccount.create({
      data: {
        userId,
        provider: 'microsoft',
        email: user.mail || user.userPrincipalName,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        calendarId: 'primary',
        active: true,
      },
    });

    return account;
  }

  private getClient(accessToken: string): Client {
    return Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
  }

  private async getAuthClient(accountId: string) {
    const account = await prisma.calendarAccount.findUnique({
      where: { id: accountId },
    });

    if (!account || !account.accessToken) {
      throw new Error('Calendar account not found or not authenticated');
    }

    return this.getClient(account.accessToken);
  }

  async syncEvents(accountId: string, userId: string) {
    const client = await this.getAuthClient(accountId);

    // Fetch events from Microsoft Calendar
    const response = await client
      .api('/me/calendar/events')
      .top(100)
      .filter(`start/dateTime ge '${new Date().toISOString()}'`)
      .orderby('start/dateTime')
      .get();

    const events = response.value || [];

    // Sync to local database
    for (const event of events) {
      const existingEvent = await prisma.calendarEvent.findFirst({
        where: { accountId, externalId: event.id },
      });

      const eventData = {
        title: event.subject || 'Untitled',
        description: event.body?.content || '',
        startTime: new Date(event.start.dateTime),
        endTime: new Date(event.end.dateTime),
        location: event.location?.displayName || '',
        attendees: event.attendees?.map((a: any) => a.emailAddress?.address || '') || [],
        recurring: !!event.recurrence,
        recurrence: event.recurrence ? JSON.stringify(event.recurrence) : '',
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
    const client = await this.getAuthClient(accountId);

    // Create event in Microsoft Calendar
    const event = await client.api('/me/calendar/events').post({
      subject: eventData.title,
      body: {
        contentType: 'HTML',
        content: eventData.description || '',
      },
      start: {
        dateTime: eventData.startTime.toISOString(),
        timeZone: 'Eastern Standard Time',
      },
      end: {
        dateTime: eventData.endTime.toISOString(),
        timeZone: 'Eastern Standard Time',
      },
      location: {
        displayName: eventData.location || '',
      },
      attendees: eventData.attendees?.map((email: string) => ({
        emailAddress: { address: email },
        type: 'required',
      })),
    });

    // Save to local database
    const localEvent = await prisma.calendarEvent.create({
      data: {
        accountId,
        userId,
        externalId: event.id,
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

    const client = await this.getAuthClient(event.accountId);

    // Update in Microsoft Calendar
    await client.api(`/me/calendar/events/${event.externalId}`).patch({
      subject: eventData.title,
      body: {
        contentType: 'HTML',
        content: eventData.description || '',
      },
      start: {
        dateTime: eventData.startTime.toISOString(),
        timeZone: 'Eastern Standard Time',
      },
      end: {
        dateTime: eventData.endTime.toISOString(),
        timeZone: 'Eastern Standard Time',
      },
      location: {
        displayName: eventData.location || '',
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

    const client = await this.getAuthClient(event.accountId);

    // Delete from Microsoft Calendar
    await client.api(`/me/calendar/events/${event.externalId}`).delete();

    // Delete from local database
    await prisma.calendarEvent.delete({
      where: { id: eventId },
    });
  }
}

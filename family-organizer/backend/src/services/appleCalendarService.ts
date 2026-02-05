import ICAL from 'ical.js';
import prisma from '../database/prisma';
import axios from 'axios';

interface AppleCalDAVConfig {
  server: string;
  username: string;
  password: string;
}

export class AppleCalendarService {
  private config: AppleCalDAVConfig;

  constructor() {
    this.config = {
      server: process.env.APPLE_CALDAV_SERVER || 'caldav.icloud.com',
      username: process.env.APPLE_CALDAV_USERNAME || '',
      password: process.env.APPLE_CALDAV_PASSWORD || '',
    };
  }

  async connect(userId: string, username: string, password: string) {
    // Test connection with CalDAV PROPFIND request
    const serverUrl = `https://${this.config.server}/`;

    try {
      const response = await axios({
        method: 'PROPFIND',
        url: serverUrl,
        auth: { username, password },
        headers: {
          'Content-Type': 'application/xml',
          'Depth': '0',
        },
      });

      if (response.status === 207) {
        // Connection successful, store credentials
        const account = await prisma.calendarAccount.create({
          data: {
            userId,
            provider: 'apple',
            email: username,
            accessToken: Buffer.from(`${username}:${password}`).toString('base64'),
            calendarId: 'primary',
            active: true,
          },
        });

        return account;
      } else {
        throw new Error('CalDAV connection failed');
      }
    } catch (error) {
      throw new Error('Failed to connect to Apple Calendar');
    }
  }

  private async getCalDAVClient(accountId: string) {
    const account = await prisma.calendarAccount.findUnique({
      where: { id: accountId },
    });

    if (!account || !account.accessToken) {
      throw new Error('Calendar account not found or not authenticated');
    }

    const [username, password] = Buffer.from(account.accessToken, 'base64').toString().split(':');

    return {
      username,
      password,
      serverUrl: `https://${this.config.server}/`,
    };
  }

  async syncEvents(accountId: string, userId: string) {
    const { username, password, serverUrl } = await this.getCalDAVClient(accountId);

    // Fetch calendars
    const calendarsResponse = await axios({
      method: 'PROPFIND',
      url: `${serverUrl}${username}/calendars/`,
      auth: { username, password },
      headers: {
        'Content-Type': 'application/xml',
        'Depth': '1',
      },
      data: `<?xml version="1.0" encoding="UTF-8"?>
        <d:propfind xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
          <d:prop>
            <d:displayname />
            <c:calendar-description />
          </d:prop>
        </d:propfind>`,
    });

    // For simplicity, we'll work with the first calendar
    // In production, you'd parse the XML response to get all calendars

    // Fetch events using calendar-query
    const now = new Date();
    const startDate = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const eventsResponse = await axios({
      method: 'REPORT',
      url: `${serverUrl}${username}/calendars/`,
      auth: { username, password },
      headers: {
        'Content-Type': 'application/xml',
        'Depth': '1',
      },
      data: `<?xml version="1.0" encoding="UTF-8"?>
        <c:calendar-query xmlns:d="DAV:" xmlns:c="urn:ietf:params:xml:ns:caldav">
          <d:prop>
            <d:getetag />
            <c:calendar-data />
          </d:prop>
          <c:filter>
            <c:comp-filter name="VCALENDAR">
              <c:comp-filter name="VEVENT">
                <c:time-range start="${startDate}"/>
              </c:comp-filter>
            </c:comp-filter>
          </c:filter>
        </c:calendar-query>`,
    });

    // Parse iCal data (simplified - you'd use a proper XML parser)
    // For now, return a placeholder
    return 0;
  }

  async createEvent(accountId: string, userId: string, eventData: any) {
    const { username, password, serverUrl } = await this.getCalDAVClient(accountId);

    // Create iCal event
    const eventId = `event-${Date.now()}`;
    const icalData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Family Organizer//EN
BEGIN:VEVENT
UID:${eventId}
DTSTART:${eventData.startTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${eventData.endTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${eventData.title}
DESCRIPTION:${eventData.description || ''}
LOCATION:${eventData.location || ''}
END:VEVENT
END:VCALENDAR`;

    // Upload to CalDAV server
    await axios({
      method: 'PUT',
      url: `${serverUrl}${username}/calendars/home/${eventId}.ics`,
      auth: { username, password },
      headers: {
        'Content-Type': 'text/calendar',
      },
      data: icalData,
    });

    // Save to local database
    const localEvent = await prisma.calendarEvent.create({
      data: {
        accountId,
        userId,
        externalId: eventId,
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
    // Similar to create, but update existing event
    throw new Error('Apple CalDAV update not fully implemented yet');
  }

  async deleteEvent(eventId: string) {
    const event = await prisma.calendarEvent.findUnique({
      where: { id: eventId },
      include: { account: true },
    });

    if (!event || !event.externalId) throw new Error('Event not found');

    const { username, password, serverUrl } = await this.getCalDAVClient(event.accountId);

    // Delete from CalDAV server
    await axios({
      method: 'DELETE',
      url: `${serverUrl}${username}/calendars/home/${event.externalId}.ics`,
      auth: { username, password },
    });

    // Delete from local database
    await prisma.calendarEvent.delete({
      where: { id: eventId },
    });
  }
}

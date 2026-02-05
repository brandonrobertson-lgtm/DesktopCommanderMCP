import { Request, Response } from 'express';

export class ContactController {
  async getContacts(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async getContact(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async createContact(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async updateContact(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async deleteContact(req: Request, res: Response) { res.json({ success: true }); }
  async getContactsByCategory(req: Request, res: Response) { res.json({ success: true, data: [] }); }
}

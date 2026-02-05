import { Request, Response } from 'express';

export class ChatController {
  async getMessages(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async sendMessage(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async editMessage(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async deleteMessage(req: Request, res: Response) { res.json({ success: true }); }
}

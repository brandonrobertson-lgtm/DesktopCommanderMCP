import { Request, Response } from 'express';

export class EmailController {
  async getAccounts(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async connectGmail(req: Request, res: Response) { res.json({ success: true }); }
  async connectMicrosoft(req: Request, res: Response) { res.json({ success: true }); }
  async connectICloud(req: Request, res: Response) { res.json({ success: true }); }
  async disconnectAccount(req: Request, res: Response) { res.json({ success: true }); }
  async getEmails(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async getEmail(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async sendEmail(req: Request, res: Response) { res.json({ success: true }); }
  async markAsRead(req: Request, res: Response) { res.json({ success: true }); }
  async toggleStar(req: Request, res: Response) { res.json({ success: true }); }
  async deleteEmail(req: Request, res: Response) { res.json({ success: true }); }
  async getFolders(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async syncEmails(req: Request, res: Response) { res.json({ success: true }); }
}

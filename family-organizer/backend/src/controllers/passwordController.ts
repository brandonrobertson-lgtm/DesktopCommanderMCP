import { Request, Response } from 'express';

export class PasswordController {
  async getPasswords(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async getPassword(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async createPassword(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async updatePassword(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async deletePassword(req: Request, res: Response) { res.json({ success: true }); }
  async getFolders(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async createFolder(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async syncAppleKeychain(req: Request, res: Response) { res.json({ success: true }); }
  async syncGooglePasswords(req: Request, res: Response) { res.json({ success: true }); }
  async syncOneDrive(req: Request, res: Response) { res.json({ success: true }); }
}

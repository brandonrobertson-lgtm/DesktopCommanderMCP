import { Request, Response } from 'express';

export class FridgeController {
  async getItems(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async getItem(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async createItem(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async updateItem(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async deleteItem(req: Request, res: Response) { res.json({ success: true }); }
  async getExpiringSoon(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async getItemsByLocation(req: Request, res: Response) { res.json({ success: true, data: [] }); }
}

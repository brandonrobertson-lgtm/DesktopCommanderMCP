import { Request, Response } from 'express';

export class GroceryController {
  async getLists(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async getList(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async createList(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async updateList(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async deleteList(req: Request, res: Response) { res.json({ success: true }); }
  async createItem(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async updateItem(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async deleteItem(req: Request, res: Response) { res.json({ success: true }); }
  async toggleCheck(req: Request, res: Response) { res.json({ success: true }); }
}

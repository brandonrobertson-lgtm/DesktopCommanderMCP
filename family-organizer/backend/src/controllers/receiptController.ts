import { Request, Response } from 'express';

export class ReceiptController {
  async getReceipts(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async getReceipt(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async uploadReceipt(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async updateReceipt(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async deleteReceipt(req: Request, res: Response) { res.json({ success: true }); }
  async getReceiptsByCategory(req: Request, res: Response) { res.json({ success: true, data: [] }); }
}

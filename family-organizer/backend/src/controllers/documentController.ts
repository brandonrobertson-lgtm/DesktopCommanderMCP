import { Request, Response } from 'express';

export class DocumentController {
  async getDocuments(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async getDocument(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async uploadDocument(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async updateDocument(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async deleteDocument(req: Request, res: Response) { res.json({ success: true }); }
  async downloadDocument(req: Request, res: Response) { res.json({ success: true }); }
  async getFolders(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async createFolder(req: Request, res: Response) { res.json({ success: true, data: {} }); }
}

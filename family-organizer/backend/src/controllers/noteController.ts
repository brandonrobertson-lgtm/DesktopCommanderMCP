import { Request, Response } from 'express';

export class NoteController {
  async getNotes(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async getNote(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async createNote(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async updateNote(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async deleteNote(req: Request, res: Response) { res.json({ success: true }); }
  async togglePin(req: Request, res: Response) { res.json({ success: true }); }
  async getFolders(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async createFolder(req: Request, res: Response) { res.json({ success: true, data: {} }); }
}

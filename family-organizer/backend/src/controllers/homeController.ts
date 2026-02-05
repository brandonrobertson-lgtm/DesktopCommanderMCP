import { Request, Response } from 'express';

export class HomeController {
  async getHomes(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async getHome(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async createHome(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async updateHome(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async deleteHome(req: Request, res: Response) { res.json({ success: true }); }
  async getAppliances(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async createAppliance(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async updateAppliance(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async deleteAppliance(req: Request, res: Response) { res.json({ success: true }); }
  async getMaintenanceRecords(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async createMaintenanceRecord(req: Request, res: Response) { res.json({ success: true, data: {} }); }
}

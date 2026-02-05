import { Request, Response } from 'express';

export class MedicationController {
  async getMedications(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async getMedication(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async createMedication(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async updateMedication(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async deleteMedication(req: Request, res: Response) { res.json({ success: true }); }
  async logMedicationTaken(req: Request, res: Response) { res.json({ success: true, data: {} }); }
  async getMedicationLogs(req: Request, res: Response) { res.json({ success: true, data: [] }); }
  async getUserMedications(req: Request, res: Response) { res.json({ success: true, data: [] }); }
}

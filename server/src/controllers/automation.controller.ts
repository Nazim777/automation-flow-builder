import { Request, Response, NextFunction } from "express";
import { AutomationService } from "../services";

class AutomationController {
  private readonly automationService: AutomationService;

  constructor() {
    this.automationService = new AutomationService();
  }

  /**
   * ==== create automation ====
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, nodes } = req.body;
      if (!name || !nodes || nodes.length < 2) {
        return res
          .status(400)
          .json({ success: false, error: "Missing required fields" });
      }

      const automation = await this.automationService.createAutomation(
        name,
        nodes,
      );
      res.status(201).json(automation);
    } catch (error: any) {
      next(error)
    }
  };

  /**
   * ==== get all automation ====
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  public getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const automations = await this.automationService.findAll();
      res.status(200).json(automations);
    } catch (error) {
      next(error);
    }
  };

  /**
   * ==== get automation ====
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  public getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const automation = await this.automationService.findById(req.params.id);
      if (!automation)
        return res.status(404).json({ success: false, error: "Not found" });
      res.status(200).json(automation);
    } catch (error) {
      next(error);
    }
  };

  /**
   * ==== update automation ====
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.automationService.updateAutomation(
        req.params.id,
        req.body,
      );
      if (!updated)
        return res.status(404).json({ success: false, error: "Not found" });
      res.status(200).json(updated);
    } catch (error: any) {
      next(error)
    }
  };

  /**
   * ==== delete automation ====
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */
  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.automationService.deleteAutomation(
        req.params.id,
      );
      if (!result)
        return res.status(404).json({ success: false, error: "Not found" });
      res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

export default AutomationController;

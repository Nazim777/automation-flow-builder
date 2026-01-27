import { Request, Response, NextFunction } from "express";
import { TestRunService } from "../services";
import { Server as SocketIOServer } from "socket.io";

class TestRunController {
  private readonly testRunService: TestRunService;

  constructor() {
    this.testRunService = new TestRunService();
  }

  /**
   * ==== start automation ====
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} _next
   */
  public start = async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { id } = req.params;
      const { email } = req.body;
      const io: SocketIOServer = (req as any).io;
      // Simple email validation
      if (!email || !email.includes("@")) {
        return res
          .status(400)
          .json({ success: false, error: "Valid email address is required" });
      }

      const testRun = await this.testRunService.startTestRun(id, email, io);

      res.status(202).json({
        success: true,
        message: "Test automation started",
        testRunId: testRun._id,
        email: testRun.email,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  };

  /**
   * ==== get history of automation ====
   * @param {express.Request} req
   * @param {express.Response} res
   * @param {express.NextFunction} next
   */

  public getHistory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { id } = req.params;
      const history = await this.testRunService.getHistoryByAutomation(id);
      res.status(200).json({ success: true, data: history });
    } catch (error: any) {
      next(error);
    }
  };
}

export default TestRunController;

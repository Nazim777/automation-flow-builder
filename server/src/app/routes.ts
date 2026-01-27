import { Router, Request, Response, NextFunction } from "express";
import { AutomationRoutes, TestRunRoutes } from "../routes";

const router: Router = Router();

/**
 * ---- Routes For API Version 01 -----
 */
router.use("/api/v1/automations", AutomationRoutes);
router.use("/api/v1/test-runs", TestRunRoutes);

/**
 * ---- Health Check for the application here ----
 * Checking for Health of application at very first time..
 */
router.get("/health", (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({
    message: "Successful",
    data: {
      message: "Server is up and running...",
    },
  });
});

/**
 * ---- Resource not found endpoint ----
 * Not Found of resource
 */
router.use("*", (_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).send("Resource not found!");
});

export default router;

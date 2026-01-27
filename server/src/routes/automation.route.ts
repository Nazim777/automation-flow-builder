import { Router } from "express";
import AutomationController from "../controllers/automation.controller";

const router = Router();

// object instance for automationController
const automationController = new AutomationController();

/**
 * ----- CREATE AUTOMATION -----
 * ----- READ AUTOMATION -------
 */
router
  .route("/")
  .post(automationController.create)
  .get(automationController.getAll);

/**
 * ----- READ AUTOMATION -------
 * ----- UPDATE AUTOMATION -----
 * ----- DELETE AUTOMATION -----
 */

router
  .route("/:id")
  .get(automationController.getOne)
  .put(automationController.update)
  .delete(automationController.delete);

export default router;

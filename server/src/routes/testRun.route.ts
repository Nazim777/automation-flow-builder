import { Router } from "express";
import TestRunController from "../controllers/testRun.controller";

const router = Router();

// // object instance for testRunController
const testRunController = new TestRunController();

/**
 * ----- CREATE TEST AUTOMATION -----
 */

router.post("/:id/test", testRunController.start);

/**
 * ----- READ TEST AUTOMATION -------
 */
router.get("/:id", testRunController.getHistory);

export default router;

// CRM-Backend\src\routes\deal.routes.js
import { Router } from "express";
import {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  updateStageHistoryNote,
  // getPipelineStats,
} from "../controllers/deal.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { validateDeal } from "../middlewares/validate.middleware.js";

const router = Router();

router.use(protect);

// router.get("/pipeline/stats", getPipelineStats);
router.route("/").get(getDeals).post(validateDeal, createDeal);
router
  .route("/:id")
  .get(getDeal)
  .put(validateDeal, updateDeal)
  .delete(authorize("ADMIN", "MANAGER"), deleteDeal);
router.put("/stage-history/:id", updateStageHistoryNote);

export default router;

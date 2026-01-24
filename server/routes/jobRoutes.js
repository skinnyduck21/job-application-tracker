import express from "express";
import {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  getJobStats,
} from "../controllers/jobsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createJob)
  .get(protect, getAllJobs);

router.get("/stats", protect, getJobStats);

router.route("/:id")
  .get(protect, getJob)
  .patch(protect, updateJob)
  .delete(protect, deleteJob);

export default router;

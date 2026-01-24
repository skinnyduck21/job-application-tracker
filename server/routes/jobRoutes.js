import express from "express";
import {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, createJob)
  .get(protect, getAllJobs);

router.route("/:id")
  .get(protect, getJob)
  .patch(protect, updateJob)
  .delete(protect, deleteJob);

export default router;

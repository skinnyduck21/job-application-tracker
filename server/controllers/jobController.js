import Job from "../models/Job.js";
import mongoose from "mongoose";

// CREATE JOB
export const createJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    createdBy: req.user.id,
  });

  res.status(201).json(job);
};

// GET ALL JOBS (ONLY USER'S)
export const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.id }).sort("-createdAt");
  res.status(200).json(jobs);
};

// GET SINGLE JOB
export const getJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid job ID" });
  }

  const job = await Job.findOne({
    _id: id,
    createdBy: req.user.id,
  });

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.status(200).json(job);
};

// UPDATE JOB
export const updateJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findOneAndUpdate(
    { _id: id, createdBy: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    return res.status(404).json({ message: "Job not found or unauthorized" });
  }

  res.status(200).json(job);
};

// DELETE JOB
export const deleteJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findOneAndDelete({
    _id: id,
    createdBy: req.user.id,
  });

  if (!job) {
    return res.status(404).json({ message: "Job not found or unauthorized" });
  }

  res.status(200).json({ message: "Job deleted successfully" });
};

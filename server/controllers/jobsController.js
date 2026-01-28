import Job from "../models/Job.js";
import mongoose from "mongoose";

// CREATE JOB
export const createJob = async (req, res) => {
  const job = await Job.create({
    ...req.body,
    createdBy: req.user.id, // ✅ FIX
  });

  res.status(201).json(job);
};


// GET ALL JOBS (SEARCH + FILTER + SORT + PAGINATION)
export const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort, page, limit } = req.query;

  // 1. Base query: user ownership
  const queryObject = {
    createdBy: req.user.id,
  };

  // 2. Filters
  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  // 3. Search (company OR position)
  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  // 4. Build query
  let result = Job.find(queryObject);

  // 5. Sorting
  if (sort === "latest") {
    result = result.sort("-createdAt");
  } else if (sort === "oldest") {
    result = result.sort("createdAt");
  } else if (sort === "a-z") {
    result = result.sort("company");
  } else if (sort === "z-a") {
    result = result.sort("-company");
  } else {
    result = result.sort("-createdAt"); // default
  }

  // 6. Pagination
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  result = result.skip(skip).limit(limitNumber);

  // 7. Execute queries
  const jobs = await result;
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limitNumber);

  res.status(200).json({
    jobs,
    totalJobs,
    numOfPages,
  });
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


// GET JOB STATS
export const getJobStats = async (req, res) => {
  const userId = req.user.id;

  // 1. Status stats
  const statusStats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Convert to object: { pending: 2, interview: 1, declined: 3 }
  const formattedStatusStats = statusStats.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  // 2. Job type stats
  const jobTypeStats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$jobType",
        count: { $sum: 1 },
      },
    },
  ]);

  const formattedJobTypeStats = jobTypeStats.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  // 3. Monthly applications (last 6 months)
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications.map((item) => {
    const { year, month } = item._id;
    const date = `${month}/${year}`;
    return { date, count: item.count };
  }).reverse();

  res.status(200).json({
    statusStats: formattedStatusStats,
    jobTypeStats: formattedJobTypeStats,
    monthlyApplications,
  });
};

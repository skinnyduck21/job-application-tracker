import { useEffect, useState } from "react";
import api from "../api/axios";
import { removeToken } from "../utils/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    statusStats: {},
    jobTypeStats: {},
    monthlyApplications: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    company: "",
    position: "",
    status: "pending",
    jobType: "internship",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const jobType = searchParams.get("jobType") || "all";
  const sort = searchParams.get("sort") || "latest";

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs", {
        params: { search, status, jobType, sort },
      });
      setJobs(res.data.jobs ?? res.data);
    } catch {
      setError("Failed to load jobs");
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/jobs/stats");
      setStats(res.data);
    } catch {
      setError("Failed to load stats");
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchJobs(), fetchStats()]).finally(() =>
      setLoading(false)
    );
    // eslint-disable-next-line
  }, [search, status, jobType, sort]);

  const updateParam = (key, value) => {
    const params = Object.fromEntries([...searchParams]);
    if (value === "all" || value === "") delete params[key];
    else params[key] = value;
    setSearchParams(params);
  };

  const logout = () => {
    removeToken();
    navigate("/login");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/jobs", form);
      setJobs((prev) => [res.data, ...prev]);
      fetchStats();
      setForm({
        company: "",
        position: "",
        status: "pending",
        jobType: "internship",
      });
    } catch {
      setError("Failed to create job");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((job) => job._id !== id));
      fetchStats();
    } catch {
      setError("Failed to delete job");
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </header>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* STATS */}
      <section>
        <h3>Stats</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {Object.entries(stats.statusStats).map(([k, v]) => (
            <div key={k} style={{ border: "1px solid #ccc", padding: 8 }}>
              <strong>{k}</strong>
              <p>{v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FILTERS */}
      <section>
        <h3>Search & Filters</h3>
        <input
          placeholder="Search jobs"
          value={search}
          onChange={(e) => updateParam("search", e.target.value)}
        />
        <select value={status} onChange={(e) => updateParam("status", e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="interview">Interview</option>
          <option value="declined">Declined</option>
        </select>
        <select value={jobType} onChange={(e) => updateParam("jobType", e.target.value)}>
          <option value="all">All Types</option>
          <option value="internship">Internship</option>
          <option value="full-time">Full-time</option>
        </select>
      </section>

      {/* ADD JOB */}
      <section>
        <h3>Add Job</h3>
        <form onSubmit={handleCreate}>
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
          <input name="position" placeholder="Position" value={form.position} onChange={handleChange} required />
          <button type="submit">Add</button>
        </form>
      </section>

      {/* JOB LIST */}
      <section>
        <h3>Your Jobs</h3>
        {jobs.length === 0 ? (
          <p>No jobs found. Start by adding one.</p>
        ) : (
          <ul>
            {jobs.map((job) => (
              <li key={job._id}>
                <strong>{job.company}</strong> – {job.position}
                <button onClick={() => handleDelete(job._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default Dashboard;

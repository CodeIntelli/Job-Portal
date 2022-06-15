import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  companyId: { type: mongoose.mongoose.Schema.Types.ObjectId, ref: "Company" },
  jobTitle: { type: String, required: true },
  jobDesc: { type: String, required: true },
  maxApplicant: { type: Number, required: true },
  maxPosition: { type: Number, required: true },
  activeApplicant: { type: Number, required: true },
  acceptedCandidate: { type: Number, required: true },
  dateOfPosting: { type: Date, required: true, default: Date.now() },
  dueDate: { type: Date, required: true },
  skills: [String],
  jobType: { type: String, required: true },
  salary: { type: Number, required: true },
  duration: { type: String, required: true },
  applyUrl: { type: String, required: true },
});

const JobModel = new mongoose.model("Job", JobSchema);
export default JobModel;

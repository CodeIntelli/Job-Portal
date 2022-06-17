import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  jobId: { type: mongoose.mongoose.Schema.Types.ObjectId, ref: "Job" },
  companyId: { type: String, required: true },
  questions: [Array],
});

let QuestionModel = new mongoose.model("Question", QuestionSchema);
export default QuestionModel;

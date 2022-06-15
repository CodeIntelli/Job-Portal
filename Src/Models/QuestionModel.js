import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  jobId: { type: mongoose.mongoose.Schema.Types.ObjectId, ref: "Job" },
  questions: {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      default: "",
    },
  },
});

let QuestionModel = new mongoose.model("Question", QuestionSchema);
export default QuestionModel;

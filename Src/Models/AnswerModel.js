import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
  companyId: {
    type: mongoose.mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  userId: {
    type: mongoose.mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  answers: {
    type: String,
    required: true,
  },
});

let AnswerModel = new mongoose.model("Answer", AnswerSchema);
export default AnswerModel;

import { QuestionModel } from "../Models";
import { ErrorHandler } from "../Services";

const QuestionController = {
    async addQuestion(req, res, next) {
        try {
            const {
                jobId,
                questions
            } = req.body;

            const question = await QuestionModel.create({
                jobId,
                questions
            });

            return res.json({ data: question, message: 'Question addded' }).status(200);
        } catch (error) {
            console.log(error);
            return next(new ErrorHandler(error, 500));
        }
    },

    async updateQuestion(req, res, next) {
        const question = await QuestionModel.findOne({ _id: req.params.questionId });

        if (!question) {
            return next(new ErrorHandler('Question not found', 400));
        }

        const newQuestionData = {
            questions: req.body.questions
        }

        const newQuestion = await QuestionModel.findByIdAndUpdate(
            req.params.questionId,
            newQuestionData
        );

        return res.json({ data: newQuestion, message: 'Question updated' }).status(200);
    },

    async retrieveQuestion(req, res, next) {
        try {
            const questions = await QuestionModel.find();
            return res.json({ data: questions, message: 'Questions retrieved' }).status(200);
        } catch (error) {
            console.log(error);
        }
    },
};

export default QuestionController;
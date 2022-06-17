import { QuestionModel } from "../Models";
import { ErrorHandler } from "../Services";
import { v4 as uuidv4 } from 'uuid';
const QuestionController = {
    async addQuestion(req, res, next) {
        try {
            const {
                jobId,
                questions
            } = req.body;

            let que_arr = [];
            if (typeof questions === "string") {
                que_arr.push(questions);
            } else {
                que_arr = questions;
            }
            const quefinalarr = [];
            for (let i = 0; i < que_arr.length; i++) {
                quefinalarr.push({
                    id: uuidv4(),
                    question: que_arr[i]
                })
            }
            console.log(quefinalarr)
            req.body.questions = quefinalarr;

            const question = await QuestionModel.create({
                jobId,
                questions: quefinalarr,
                companyId: req.body.id
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

    async deleteQuestion(req, res, next) {
        try {
            const question = await QuestionModel.findById(req.params.questionId);
            if (!question) {
                return next(new ErrorHandler('question not found'));
            }
            await question.remove();
            return res.json({ message: 'Question Deleted Successfully' }).status(200);
        } catch (error) {
            console.log(error);
        }
    }
};

export default QuestionController;

import express from 'express';
let QuestionRoutes = express.Router();
import { QuestionController } from "../Controller";
// import { Authorization } from "../Middleware";

QuestionRoutes.post(
    "/addQuestion",
    // Authorization("admin"),
    QuestionController.addQuestion
);

QuestionRoutes.put(
    "/updateQuestion/:questionId",
    //Authorization("admin"),
    QuestionController.updateQuestion
);

QuestionRoutes.get(
    "/retrieveQuestion",
    QuestionController.retrieveQuestion
);

// QuestionRoutes.delete(
//     "/deleteQuestion/:questionId",
//     //Authorization("admin"),
//     QuestionController.deleteQuestion
// );

export default QuestionRoutes;
import express from 'express';
let JobRoutes = express.Router();
import { JobController } from "../Controller";
// import { Authorization } from '../Middleware';

JobRoutes.post(
    "/addJob",
    //Authorization("admin"),
    JobController.addJob
);

JobRoutes.put(
    "/updateJob/:jobId",
    //Authorization("admin"),
    JobController.updateJob
);

JobRoutes.get(
    "/retrieveJob",
    JobController.retrieveJob
);

JobRoutes.delete(
    "/deleteJob/:jobId",
    //Authorization("admin"),
    JobController.deleteJob
);

export default JobRoutes;
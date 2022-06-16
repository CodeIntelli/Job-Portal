import express from 'express';
let JobRoutes = express.Router();
import { JobController } from "../Controller";
import { Authentication, Authorization } from '../Middleware';

JobRoutes.post("/addJob", JobController.addJob);
JobRoutes.put("/updateJob/:jobId", JobController.updateJob);

export default JobRoutes;
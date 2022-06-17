import { JobModel } from "../Models";
import { ErrorHandler } from "../Services";

const JobController = {
    async addJob(req, res, next) {
        try {
            const {
                companyId,
                jobTitle,
                jobDesc,
                maxApplicant,
                maxPosition,
                activeApplicant,
                acceptedCandidate,
                dateOfPosting,
                dueDate,
                skills,
                jobType,
                salary,
                duration,
                applyUrl
            } = req.body;

            const job = await JobModel.create({
                companyId,
                jobTitle,
                jobDesc,
                maxApplicant,
                maxPosition,
                activeApplicant,
                acceptedCandidate,
                dateOfPosting,
                dueDate,
                skills,
                jobType,
                salary,
                duration,
                applyUrl
            });

            return res.json({ data: job, message: 'Job addded' }).status(200);
        } catch (error) {
            console.log(error);
            return next(new ErrorHandler(error, 500));
        }
    },

    async updateJob(req, res, next) {
        const job = await JobModel.findOne({ _id: req.params.jobId });

        if (!job) {
            return next(new ErrorHandler("Job not found", 400));
        }

        const newJobData = {
            jobTitle: req.body.jobTitle,
            jobDesc: req.body.jobDesc,
            maxApplicant: req.body.maxApplicant,
            maxPosition: req.body.maxPosition,
            activeApplicant: req.body.activeApplicant,
            acceptedCandidate: req.body.acceptedCandidate,
            dateOfPosting: req.body.dateOfPosting,
            dueDate: req.body.dueDate,
            skills: req.body.skills,
            jobType: req.body.jobType,
            salary: req.body.salary,
            duration: req.body.duration,
            applyUrl: req.body.applyUrl
        }

        const newJob = await JobModel.findByIdAndUpdate(
            req.params.jobId,
            newJobData
        );

        return res.json({ data: newJob, message: 'Job updated' }).status(200);
    },

    async retrieveJob(req, res, next) {
        try {
            const jobs = await JobModel.find();
            return res.json({ data: jobs, message: 'Jobs retrieved' }).status(200);
        } catch (error) {
            console.log(error);
        }
    },

    async deleteJob(req, res, next) {
        try {
            const job = await JobModel.findById(req.params.jobId);
            if (!job) {
                return next(new ErrorHandler('Job not found'));
            }
            await job.remove();
            return res.json({ message: 'Job Deleted Successfully' }).status(200);
        } catch (error) {
            console.log(error);
        }
    }

};

export default JobController;
import { JobModel } from "../Models";
import { ErrorHandler } from "../Services";

const JobController = {
    async addJob(req, res, next) {
        try {
            console.log(req.body);
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
        const { jobId } = req.params.jobId;
        if (!jobId) {
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

        const job = await JobModel.findByIdAndUpdate(
            req.params.jobId,
            newJobData
        );

        return res.json({ /* data: job, */ message: 'Job updated' }).status(200);
    }
};

export default JobController;
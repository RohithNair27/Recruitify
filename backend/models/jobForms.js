const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Userauth = require("./userModel.js");

const JobApplicationFormSchema = new Schema({
    jobRole: {
        type: String,
        required: [true, "Please Enter Job Role"],
        maxLength: [50, "Job Role exceed 50 characters"],
        minLength: [5, "Job Role have more than 4 characters"]
    },
    jobLocation: {
        type: String,
        required: [true, "Please Enter Job Location"],
        maxLength: [100, "Job Location exceed 100 characters"],
        minLength: [5, "Job Location have more than 4 characters"]
    },
    jobLocationType: {
        type: String,
        enum: ['on-site', 'remote'],
        required: false,
    },
    company: {
        type: String,
        required: [true, "Please Enter Company Name"],
        maxLength: [50, "Company Name exceed 50 characters"],
        minLength: [2, "Company Name have more than  1 characters"]
    },
    requiredSkills: [{
        type: String,
        required: false,
    }],
    totalDuration: {
        value: { type: Number },
        mode: { type: String, enum: ['month', 'year', 'full-time'] },
    },
    workingHours: {
        value: { type: Number },
        mode: { type: String, enum: ['hour'] }
    },
    salary: {
        value: { type: Number },
        currency: { type: String, enum: ['dollar', 'rupee', 'euro', 'yen'] },
        mode: { type: String, enum: ['per-hour', 'per-day', 'per-month', 'per-annum'] }
    },
    jobDescription: {
        type: String,
        required: true,
    },
    ownerProfile: {
        type: Schema.Types.ObjectId,
        ref: 'Userauth',
        required: true,
    },
    resume: [{
        fileName: {
            type: String,
            required: true,
        },
        filePath: {
            type: String,
            required: true,
        },
        fileType: {
            type: String,
            required: true,
        },
        fileSize: {
            type: String,
            required: true,
        },
    }],
    applicantProfiles: [{
        type: Schema.Types.ObjectId,
        ref: 'Userauth',
    }],
    timestamp: { type: Date, default: Date.now },
    updated: { type: Date }
});

JobApplicationFormSchema.pre('save', function(next) {
    let isError = false;
    let errStr = '';

    // Checking totalDuration
    if (this.totalDuration && this.totalDuration.value && !this.totalDuration.mode) {
        errStr += 'Total-duration-mode (as total duration is mentioned)';
        isError = true;
    }

    // Checking workingHours
    if (this.workingHours && this.workingHours.value && !this.workingHours.mode) {
        if (isError) errStr += ", ";
        errStr += 'Working-hours-mode (as working hour is mentioned)';
        isError = true;
    }

    // Checking salary
    if (this.salary && this.salary.value && (!this.salary.currency || !this.salary.mode)) {
        if (isError) errStr += ", ";
        errStr += 'Salary currency or mode (as salary is mentioned)';
        isError = true;
    }

    if (isError) {
        const err = new Error(errStr);
        return next(err);
    }
    this.updated = Date.now();
    next();
});

const JobApplicationForm = mongoose.model('JobApplicationForm', JobApplicationFormSchema);

module.exports = JobApplicationForm;
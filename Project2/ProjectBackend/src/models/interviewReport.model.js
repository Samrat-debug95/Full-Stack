const mongoose = require("mongoose")

const technicalQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true
        }, 
        intention: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    },

    {
        _id: false
    }
)

const behavioralQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true
        },
        intention: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    },

    {
        _id: false
    }
)

const skillGapsSchema = new mongoose.Schema(
    {
        skill: {
            type: String,
            required: true
        },
        severity: {
            type: String,
            required: true,
            enum: ["low", "medium", "high"]
        }
    },

    {
        _id: false
    }
)

const preparationPlanSchema = new mongoose.Schema(
    {
        day: {
            type: Number,
            required: true
        },
        focus: {
            type: String,
            required: true
        },
        tasks: [{
            type: String,
            required: true
        }]
    },

    {
        _id: false
    }
)


const interbiewReportSchema = new mongoose.Schema(
    {
        jobDescription: {
            type: String,
            required: true,

        },
        resume: {
            type: String,
        },
        selfDescription: {
            type: String,
            required: true
        },
        matchScore: {
            type: Number,
            min: 0,
            max: 100
        },
        technicalQuestions: [technicalQuestionSchema],
        behavioralQuestions: [behavioralQuestionSchema],
        skillGap: [skillGapsSchema],
        preperationPlan: [preparationPlanSchema],
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        title:{
            type:String,
            required:true
        }
    },

    {
        timestamps: true
    }
)

const interviewReportModel = mongoose.model("InretviewReport", interbiewReportSchema)

module.exports = interviewReportModel
const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")

async function interviewReportControllers(req, res) {
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

    const { jobDescription, selfDescription } = req.body

    const report = await generateInterviewReport(
        resumeContent.text,
        selfDescription,
        jobDescription
    );


    const interviewReport = await interviewReportModel.create(
        {
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...report
        }
    )

    return res.status(201).json({
        message: "Report Generate Successfully",
        interviewReport
    })
}


async function getInterviewReportById(req, res) {
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne(
        {
            _id: interviewId,
            user: req.user.id
        }
    )

    if (!interviewReport) {
        return res.status(404).json(
            {
                message: "Interview Report not found"
            }
        )
    }

    res.status(200).json(
        {
            message: "Interview report fetched successfully",
            interviewReport
        }
    )
}

async function getAllInterviewReportsOfUser(req, res) {
    const interviewReports = await interviewReportModel.find(
        {
            user: req.user.id
        }
    ).sort(
        {
            createdAt: -1
        }
    ).select("-resume -selfDescription -jobDescription -_v -technicalQuestions -behavioralQuestions -skillGap -preperationPlan")

    res.status(200).json(
        {
            message:"Interview Report fetched successfully",
            interviewReports
        }
    )
}
module.exports = { interviewReportControllers, getInterviewReportById, getAllInterviewReportsOfUser }
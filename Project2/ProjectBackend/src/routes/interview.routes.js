const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middleware/file.middleware")

const interviewRouter = express.Router()

/**
 * @route POST /api/interview/reports
 * @description generate interview reports on the basis of self Description, job Description and Resume
 * @access private
 */

interviewRouter.post('/reports', authMiddleware, upload.single("resume"), interviewController.interviewReportControllers)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by intervierId
 * @access private
 */

interviewRouter.get("/report/:interviewId", authMiddleware, interviewController.getInterviewReportById)

/**
 * @route GET /api/interview/all-reports
 * @description get all interview report of logged in user
 * @access private
 */

interviewRouter.get("/all-reports", authMiddleware, interviewController.getAllInterviewReportsOfUser)

module.exports = interviewRouter
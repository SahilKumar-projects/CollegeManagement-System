const Exam = require("../models/exam.model");
const ApiResponse = require("../utils/ApiResponse");

const getAllExamsController = async (req, res) => {
  try {
    const { examType, semester } = req.query;

    const query = {};
    if (semester) query.semester = Number(semester);
    if (examType) query.examType = examType;

    const exams = await Exam.find(query);

    if (!exams.length) {
      return ApiResponse.notFound("No Exams Found").send(res);
    }

    return ApiResponse.success(exams, "All Exams Loaded!").send(res);
  } catch (error) {
    console.error("Get Exam Error:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

const addExamController = async (req, res) => {
  try {
    const { name, date, semester, examType, totalMarks } = req.body;

    // ✅ VALIDATION
    if (!name || !date || !semester || !examType || !totalMarks) {
      return ApiResponse.badRequest("All fields are required").send(res);
    }

    if (!req.file) {
      return ApiResponse.badRequest("Timetable file is required").send(res);
    }

    const exam = await Exam.create({
      name,
      date,
      semester: Number(semester),
      examType,
      totalMarks: Number(totalMarks),
      timetableLink: req.file.filename,
    });

    return ApiResponse.created(exam, "Exam Added Successfully!").send(res);
  } catch (error) {
    console.error("Add Exam Error:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

const updateExamController = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.timetableLink = req.file.filename;
    }

    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!exam) {
      return ApiResponse.notFound("Exam not found").send(res);
    }

    return ApiResponse.success(exam, "Exam Updated Successfully!").send(res);
  } catch (error) {
    console.error("Update Exam Error:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

const deleteExamController = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      return ApiResponse.notFound("Exam not found").send(res);
    }

    return ApiResponse.success(null, "Exam Deleted Successfully").send(res);
  } catch (error) {
    console.error("Delete Exam Error:", error);
    return ApiResponse.internalServerError(error.message).send(res);
  }
};

module.exports = {
  getAllExamsController,
  addExamController,
  updateExamController,
  deleteExamController,
};

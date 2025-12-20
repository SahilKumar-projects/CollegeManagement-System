const express = require("express");
const {
  getAllExamsController,
  addExamController,
  updateExamController,
  deleteExamController,
} = require("../controllers/exam.controller");
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");

const router = express.Router();

router.get("/", auth, getAllExamsController);

// ✅ field name MATCHES controller & frontend
router.post("/", auth, upload.single("timetableLink"), addExamController);
router.patch("/:id", auth, upload.single("timetableLink"), updateExamController);

router.delete("/:id", auth, deleteExamController);

module.exports = router;


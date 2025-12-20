const connectToMongo = require("./Database/db");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const fs = require("fs");


const mediaPath = path.join(__dirname, "media");
if (!fs.existsSync(mediaPath)) {
  fs.mkdirSync(mediaPath, { recursive: true });
}


connectToMongo();


app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello 👋 Backend is running successfully 🚀");
});

app.use("/media", express.static(mediaPath));


app.use("/api/auth/admin", require("./routes/details/admin-details.route"));
app.use("/api/auth/faculty", require("./routes/details/faculty-details.route"));
app.use("/api/auth/student", require("./routes/details/student-details.route"));


app.use("/api/branch", require("./routes/branch.route"));
app.use("/api/subject", require("./routes/subject.route"));
app.use("/api/notice", require("./routes/notice.route"));
app.use("/api/timetable", require("./routes/timetable.route"));
app.use("/api/material", require("./routes/material.route"));
app.use("/api/exam", require("./routes/exam.route"));
app.use("/api/marks", require("./routes/marks.route"));


const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('multer');
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // needed to parse formData
app.use(express.static('public')); // for static files
app.use(express.urlencoded({ extended: true }));


// In-memory database
let allCourses = []; // ✅ Empty default courses
let enrollments = []; // ✅ Empty default enrollments

// Routes

// ✅ Get all courses
app.get('/api/courses', (req, res) => {
  res.json(allCourses);
});

// ✅ Get all enrollments
app.get('/api/enrollments', (req, res) => {
  res.json(enrollments);
});

// ✅ Add new course (formData with instructor and thumbnailUrl)
app.post('/api/courses', multer().none(), (req, res) => {

  const { name, category, description, level, instructor, thumbnailUrl, aboutInstructor, overallDuration } = req.body;


  // Extract sections
  const sections = [];
  for (const key in req.body) {
    const match = key.match(/^sections\[(\d+)](?:\[videos\]\[(\d+)]\[(\w+)]|\[title])$/);
    if (match) {
      const sectionIndex = parseInt(match[1]);
      sections[sectionIndex] = sections[sectionIndex] || { title: '', videos: [] };

      if (match[2] === undefined) {
        // it's a section title
        sections[sectionIndex].title = req.body[key];
      } else {
        // it's a video property
        const videoIndex = parseInt(match[2]);
        const prop = match[3];

        sections[sectionIndex].videos[videoIndex] = sections[sectionIndex].videos[videoIndex] || {};
        sections[sectionIndex].videos[videoIndex][prop] = req.body[key];
      }
    }
  }

  const newCourse = {
    id: Date.now(),
    name,
    category,
    description,
    level,
    instructor,
    aboutInstructor,     // ✅ new
  overallDuration,
    thumbnailUrl,
    views: 0,
    sections
  };

  allCourses.push(newCourse);
  res.status(201).json(newCourse);
});

// ✅ Enroll in a course
app.post('/api/enrollments', (req, res) => {
  const { courseId } = req.body;
  const newEnrollment = {
    id: Date.now(),
    courseId: Number(courseId),
    progress: 0
  };
  enrollments.push(newEnrollment);
  res.status(201).json(newEnrollment);
});

// ✅ Unenroll from a course
app.delete('/api/enrollments/:courseId', (req, res) => {
  const courseId = Number(req.params.courseId);
  enrollments = enrollments.filter(e => e.courseId !== courseId);
  res.status(204).send();
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

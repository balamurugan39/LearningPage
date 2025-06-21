const express = require('express');
const cors = require('cors');
const multer = require('multer'); // for handling multipart/form-data
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // to serve thumbnails or uploads

// In-memory data
let allCourses = [
  {
    id: 101,
    name: "Data Science",
    description: "Learn data analysis and visualization",
    category: "Data",
    level: "Intermediate",
    thumbnail: "/data-science-thumb.jpg",
    views: 1500
  },
  {
    id: 102,
    name: "Mobile Development",
    description: "Build cross-platform apps",
    category: "Mobile",
    level: "Beginner",
    thumbnail: "/mobile-thumb.jpg",
    views: 800
  }
];

let enrollments = [
  {
    id: 1,
    courseId: 101,
    progress: 75
  },
  {
    id: 2,
    courseId: 102,
    progress: 40
  }
];

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes

// Get all courses
app.get('/api/courses', (req, res) => {
  res.json(allCourses);
});

// Get all enrollments
app.get('/api/enrollments', (req, res) => {
  res.json(enrollments);
});

// Create new course
app.post('/api/courses', upload.single('thumbnail'), (req, res) => {
  const { name, category, description, level } = req.body;
  const sections = [];

  // Parse sections manually from FormData keys
  for (const key in req.body) {
    if (key.startsWith('sections')) {
      // Example key: sections[0][title], sections[0][videos][0][title]
      const match = key.match(/sections\[(\d+)](\[videos\]\[(\d+)]\[(\w+)])?(\[title])?/);
      if (match) {
        const secIndex = Number(match[1]);
        allCourses.sections = allCourses.sections || [];
        sections[secIndex] = sections[secIndex] || { title: '', videos: [] };

        if (match[5] === '[title]') {
          sections[secIndex].title = req.body[key];
        } else if (match[2]) {
          const vidIndex = Number(match[3]);
          const vidProp = match[4];
          sections[secIndex].videos[vidIndex] = sections[secIndex].videos[vidIndex] || {};
          sections[secIndex].videos[vidIndex][vidProp] = req.body[key];
        }
      }
    }
  }

  const newCourse = {
    id: Date.now(),
    name,
    category,
    description,
    level,
    thumbnail: req.file ? `/uploads/${req.file.filename}` : '',
    views: 0,
    sections
  };

  allCourses.push(newCourse);
  res.status(201).json(newCourse);
});

// Enroll
app.post('/api/enrollments', (req, res) => {
  const { courseId } = req.body;
  const newEnrollment = {
    id: Date.now(),
    courseId,
    progress: 0
  };
  enrollments.push(newEnrollment);
  res.status(201).json(newEnrollment);
});

// Unenroll
app.delete('/api/enrollments/:courseId', (req, res) => {
  const courseId = Number(req.params.courseId);
  enrollments = enrollments.filter(e => e.courseId !== courseId);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

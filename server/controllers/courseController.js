const Course = require('../models/Course');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    console.log('Received course data:', req.body); // ✅ debug log
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    console.error('Error while saving course:', err); // ✅ print real error
    res.status(500).json({ error: 'Failed to create course', details: err.message });
  }
};

const express = require('express');
const router = express.Router();
const { getAllCourses, createCourse } = require('../controllers/courseController');

router.get('/', getAllCourses);
router.post('/', createCourse);

module.exports = router;
router.patch('/:id/enroll', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { enrolled: true },
      { new: true }
    );
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Enrollment failed' });
  }
});
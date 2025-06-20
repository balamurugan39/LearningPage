const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  level: String,
  thumbnail: String,
  videoUrl: String,
  duration: String,
  instructor: String,
  progress: Number,
  enrolled: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Course', courseSchema);
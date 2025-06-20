const EnrolledCourseCard = ({ course }) => {
  return (
    <div className="enrolled-course-card">
      <div 
        className="course-thumbnail"
        style={{ backgroundImage: `url(${course.thumbnail})` }}
      >
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
      </div>
      <div className="course-details">
        <h3>{course.title}</h3>
        <p>{course.progress}% completed</p>
      </div>
    </div>
  )
}

export default EnrolledCourseCard
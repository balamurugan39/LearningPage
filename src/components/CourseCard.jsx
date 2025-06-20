import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'

const CourseCard = ({ course, onEnroll }) => {
  return (
    <div className="course-card">
      <div 
        className="course-thumbnail"
        style={{ backgroundImage: `url(${course.thumbnail})` }}
      >
        {course.enrolled && (
          <span className="enrolled-badge">Enrolled</span>
        )}
      </div>

      <div className="course-details">
        <h3>{course.name}</h3>
        <p>{course.description}</p>

        <div className="course-meta">
          <span><FontAwesomeIcon icon={faEye} /> {course.views || 0} views</span>
        </div>

        {!course.enrolled && (
          <button className="enroll-btn" onClick={() => onEnroll(course._id)}>
            Enroll
          </button>
        )}
      </div>
    </div>
  )
}

export default CourseCard
import { useState } from 'react'
import Header from '../components/Header'
import EnrolledCourseCard from '../components/EnrolledCourseCard'
import CourseCard from '../components/CourseCard'
import AddCourseModal from '../components/AddCourseModal'
import { coursesData } from '../data'

const Home = () => {
  const [courses, setCourses] = useState(coursesData)
  const [activeTab, setActiveTab] = useState('courses')
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const addCourse = (newCourse) => {
    setCourses(prev => ({
      ...prev,
      allCourses: [...prev.allCourses, {
        ...newCourse,
        id: Date.now(),
        views: 0
      }]
    }))
    setShowModal(false)
  }

  const filteredCourses = courses.allCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="home-page">
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddCourse={() => setShowModal(true)}
      />

      <main className="main-content">
        {activeTab === 'enrolled' && (
          <section className="enrolled-section">
            <h2>Your Enrolled Courses</h2>
            <div className="enrolled-courses-container">
              <div className="enrolled-courses">
                {courses.enrolled.map(course => (
                  <EnrolledCourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="courses-section">
          <div className="section-header">
            <h2>{activeTab === 'enrolled' ? 'Recommended Courses' : 'All Courses'}</h2>
          </div>
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </main>

      {showModal && (
        <AddCourseModal
          onClose={() => setShowModal(false)}
          onSubmit={addCourse}
        />
      )}
    </div>
  )
}

export default Home
import { useState, useEffect, useRef } from 'react';
import './index.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [newCourse, setNewCourse] = useState({
  name: '',
  category: '',
  description: '',
  level: 'Beginner',
  instructor: '', // ✅ new field
  thumbnailUrl: '', // ✅ new field
  sections: [{
    title: '',
    videos: [{ title: '', videoUrl: '', duration: '' }]
  }]
});

  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const thumbnailInputRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [editingSectionIndex, setEditingSectionIndex] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await fetch('/api/courses');
        const coursesData = await coursesRes.json();
        
        const enrollRes = await fetch('/api/enrollments');
        const enrollData = await enrollRes.json();
        
        setAllCourses(coursesData);
        setEnrolledCourses(enrollData);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    
    fetchData();
  }, []);

  // Section and Video Management
  const addSection = () => {
    setNewCourse({
      ...newCourse,
      sections: [
        ...newCourse.sections,
        {
          title: '',
          videos: [{ title: '', videoUrl: '', duration: '' }]
        }
      ]
    });
    setEditingSectionIndex(newCourse.sections.length);
  };

  const updateSectionTitle = (index, title) => {
    const updatedSections = [...newCourse.sections];
    updatedSections[index].title = title;
    setNewCourse({ ...newCourse, sections: updatedSections });
  };

  const addVideoToSection = (sectionIndex) => {
    const updatedSections = [...newCourse.sections];
    updatedSections[sectionIndex].videos.push({
      title: '',
      videoUrl: '',
      duration: ''
    });
    setNewCourse({ ...newCourse, sections: updatedSections });
  };

  const handleVideoUrlChange = (sectionIndex, videoIndex, url) => {
    const updatedSections = [...newCourse.sections];
    updatedSections[sectionIndex].videos[videoIndex].videoUrl = url;
    setNewCourse({ ...newCourse, sections: updatedSections });
  };

  const removeSection = (index) => {
    const updatedSections = [...newCourse.sections];
    updatedSections.splice(index, 1);
    setNewCourse({ ...newCourse, sections: updatedSections });
  };

  const removeVideoFromSection = (sectionIndex, videoIndex) => {
    const updatedSections = [...newCourse.sections];
    updatedSections[sectionIndex].videos.splice(videoIndex, 1);
    setNewCourse({ ...newCourse, sections: updatedSections });
  };

  // Course Management
  const handleAddCourse = async () => {
  if (
    !newCourse.name ||
    !newCourse.category ||
    !newCourse.description ||
    !newCourse.instructor ||
    !newCourse.thumbnailUrl
  ) {
    alert('Please fill all required fields');
    return;
  }

  const formData = new FormData();
  formData.append('name', newCourse.name);
  formData.append('category', newCourse.category);
  formData.append('description', newCourse.description);
  formData.append('level', newCourse.level);
  formData.append('instructor', newCourse.instructor); // ✅ Added instructor
  formData.append('thumbnailUrl', newCourse.thumbnailUrl); // ✅ Using URL instead of file

  newCourse.sections.forEach((section, sectionIndex) => {
    formData.append(`sections[${sectionIndex}][title]`, section.title);
    section.videos.forEach((video, videoIndex) => {
      formData.append(
        `sections[${sectionIndex}][videos][${videoIndex}][videoUrl]`,
        video.videoUrl
      );
      formData.append(
        `sections[${sectionIndex}][videos][${videoIndex}][title]`,
        video.title
      );
      formData.append(
        `sections[${sectionIndex}][videos][${videoIndex}][duration]`,
        video.duration
      );
    });
  });

  try {
    const response = await fetch('/api/courses', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    setAllCourses([...allCourses, data]);
    setShowAddForm(false);
    setNewCourse({
      name: '',
      category: '',
      description: '',
      level: 'Beginner',
      instructor: '',        // ✅ Reset
      thumbnailUrl: '',      // ✅ Reset
      sections: []
    });
  } catch (error) {
    console.error('Error creating course:', error);
  }
};


  // Enrollment Management
  const handleEnrollCourse = async (courseId) => {
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId })
      });
      const data = await response.json();
      setEnrolledCourses([...enrolledCourses, data]);
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  const handleUnenrollCourse = async (courseId) => {
    try {
      await fetch(`/api/enrollments/${courseId}`, {
        method: 'DELETE'
      });
      setEnrolledCourses(enrolledCourses.filter(ec => ec.courseId !== courseId));
    } catch (error) {
      console.error('Error unenrolling:', error);
    }
  };

  // Search and Filter
  const filteredCourses = allCourses.filter(course => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === '' || 
      course.name.toLowerCase().includes(searchLower) || 
      (course.category && course.category.toLowerCase().includes(searchLower));

    if (activeTab === 'enrolled') {
      return enrolledCourses.some(ec => ec.courseId === course.id) && matchesSearch;
    }
    return matchesSearch;
  });

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(ec => ec.courseId === courseId);
  };

  // UI Helpers
  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="learning-platform">
      <header className="platform-header">
        <div className="header-content">
          <div className="branding">
            <img 
              src="/logo.png" 
              alt="Maestrominds Logo"
              className="logo"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/40x40?text=MM";
              }}
            />
            <div className="branding-text">
              <h1>Maestro hub</h1>
              <p className="subtitle">Learning Platform</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="search-bar">
              <input
                type="text"
                placeholder={`Search ${activeTab === 'all' ? 'all' : 'my'} courses...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="search-icon">🔍</i>
            </div>
            
            <div className="nav-tabs">
              <button 
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Courses
              </button>
              <button 
                className={`tab-btn ${activeTab === 'enrolled' ? 'active' : ''}`}
                onClick={() => setActiveTab('enrolled')}
              >
                My Courses
              </button>
            </div>
            
            <button 
              className="add-course-btn"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              + Add Course
            </button>
          </div>
        </div>
      </header>

      <main className="platform-main">
        {showAddForm && (
          <div className="course-form-container">
            <div className="course-form">
              <h2>Create New Course</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Course Title*</label>
                  <input
                    type="text"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                    placeholder="e.g. Advanced React"
                    required
                  />
                </div>
                <div className="form-group">
  <label>Instructor Name*</label>
  <input
    type="text"
    value={newCourse.instructor}
    onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
    placeholder="e.g. John Doe"
    required
  />
</div>

<div className="form-group">
  <label>Thumbnail Image URL*</label>
  <input
  type="url"
  value={newCourse.thumbnailUrl}
  onChange={(e) => setNewCourse({ ...newCourse, thumbnailUrl: e.target.value })}
  placeholder="Paste image URL ending in .jpg or .png"
  pattern="https://.*\.(jpg|jpeg|png|webp)"
  required
/>

</div>


                <div className="form-group">
                  <label>Category*</label>
                  <input
                    type="text"
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                    placeholder="e.g. Web Development"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Level*</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
                    required
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="form-group span-2">
                  <label>Description*</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    placeholder="Course description..."
                    rows="4"
                    required
                  />
                </div>
                
                
                <div className="form-group span-2">
                  <label>Course Sections & Videos</label>
                  <div className="sections-container">
                    {newCourse.sections.length === 0 ? (
                      <p className="no-sections">No sections added yet</p>
                    ) : (
                      newCourse.sections.map((section, sectionIndex) => (
                        <div key={`section-${sectionIndex}`} className="section-card">
                          <div className="section-header">
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                              placeholder="Section title"
                              className="section-title-input"
                            />
                            <button 
                              className="section-remove-btn"
                              onClick={() => removeSection(sectionIndex)}
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="videos-container">
                            {section.videos.map((video, videoIndex) => (
                              <div key={`video-${sectionIndex}-${videoIndex}`} className="video-input-group">
                                <input
                                  type="text"
                                  value={video.title}
                                  onChange={(e) => {
                                    const updatedSections = [...newCourse.sections];
                                    updatedSections[sectionIndex].videos[videoIndex].title = e.target.value;
                                    setNewCourse({...newCourse, sections: updatedSections});
                                  }}
                                  placeholder={`Video ${sectionIndex + 1}.${videoIndex + 1} Title`}
                                />
                                
                                <input
                                  type="url"
                                  value={video.videoUrl}
                                  onChange={(e) => handleVideoUrlChange(sectionIndex, videoIndex, e.target.value)}
                                  placeholder="https://example.com/video"
                                  pattern="https://.*"
                                  required
                                />
                                
                                <input
                                  type="text"
                                  value={video.duration}
                                  onChange={(e) => {
                                    const updatedSections = [...newCourse.sections];
                                    updatedSections[sectionIndex].videos[videoIndex].duration = e.target.value;
                                    setNewCourse({...newCourse, sections: updatedSections});
                                  }}
                                  placeholder="Duration (e.g. 10:30)"
                                />
                                
                                <button
                                  className="remove-video-btn"
                                  onClick={() => removeVideoFromSection(sectionIndex, videoIndex)}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <button 
                              className="add-video-btn"
                              onClick={() => addVideoToSection(sectionIndex)}
                            >
                              + Add Video
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                    <button 
                      className="add-section-btn"
                      onClick={addSection}
                    >
                      + Add Section
                    </button>
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button className="secondary-btn" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button className="primary-btn" onClick={handleAddCourse}>
                  Create Course
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'all' && (
          <>
            {enrolledCourses.length > 0 && searchTerm === '' && (
              <section className="enrolled-courses-section">
                <div className="section-header">
                  <h2>Continue Learning</h2>
                  <p>Your enrolled courses</p>
                </div>
                <div className="scroll-container">
                  <button className="scroll-arrow left-arrow" onClick={scrollLeft}>
                    &lt;
                  </button>
                  <div className="enrolled-courses-scroll" ref={scrollContainerRef}>
                    {enrolledCourses.map(enrollment => {
                      const course = allCourses.find(c => c.id === enrollment.courseId);
                      if (!course) return null;
                      
                      return (
                        <div key={`enrolled-${enrollment.id}`} className="enrolled-course-card">
                          <div className="course-media">
                            <img
  src={course.thumbnailUrl}
  alt={course.name}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/300x200?text=No+Image';
  }}
  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
/>

                            
                            <div className="progress-container">
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ width: `${enrollment.progress}%` }}
                                ></div>
                              </div>
                              <span>{enrollment.progress}% Complete</span>
                            </div>
                          </div>
                          <div className="course-details">
                            <h3>{course.name}</h3>
                            <p className="instructor">By {course.instructor}</p>
                            <p className="description">{course.description}</p>
                            <div className="course-actions">
                              <button className="continue-btn">Continue Learning</button>
                              <button 
                                className="unenroll-btn"
                                onClick={() => handleUnenrollCourse(enrollment.courseId)}
                              >
                                Unenroll
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button className="scroll-arrow right-arrow" onClick={scrollRight}>
                    &gt;
                  </button>
                </div>
              </section>
            )}

            <section className="all-courses-section">
              <div className="section-header">
                <h2>Explore Our Courses</h2>
                <p>{allCourses.length} courses available</p>
              </div>
              <div className="courses-grid">
                {filteredCourses.map(course => (
                  <div key={`course-${course.id}`} className="course-card">
                    <div className="card-media">
                      <img
  src={course.thumbnailUrl}
  alt={course.name}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/300x200?text=No+Image';
  }}
  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
/>

                      {isEnrolled(course.id) && (
                        <div className="enrolled-badge">Enrolled</div>
                      )}
                    </div>
                    <div className="card-body">
                      <div className="course-meta">
                        <span className="category">{course.category || 'General'}</span>
                        <span className="duration">{course.duration}</span>
                      </div>
                      <h3>{course.name}</h3>
                      <p className="description">{course.description}</p>
                      <div className="card-actions">
                        <button 
                          className={`enroll-btn ${isEnrolled(course.id) ? 'enrolled' : ''}`}
                          onClick={() => isEnrolled(course.id) ? null : handleEnrollCourse(course.id)}
                        >
                          {isEnrolled(course.id) ? 'Continue' : 'Enroll Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === 'enrolled' && (
          <section className="my-courses-vertical">
            <div className="section-header">
              <h2>My Courses</h2>
              <p>
                {searchTerm 
                  ? `Search results for "${searchTerm}"` 
                  : `Showing ${enrolledCourses.length} enrolled courses`}
              </p>
            </div>
            <div className="vertical-courses-list">
              {filteredCourses.length > 0 ? (
                filteredCourses.map(course => {
                  const enrollment = enrolledCourses.find(ec => ec.courseId === course.id);
                  if (!enrollment) return null;
                  
                  return (
                    <div key={`mycourse-${course.id}`} className="vertical-course-card">
                      <div className="course-media">
                        <img 
                          src={course.thumbnail} 
                          alt={course.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/300x200?text=Course+Image";
                          }}
                        />
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div 
                              className="progress-fill" 
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span>{enrollment.progress}% Complete</span>
                        </div>
                      </div>
                      <div className="course-details">
                        <h3>{course.name}</h3>
                        <div className="course-meta">
                          <span className="instructor">By {course.instructor}</span>
                          <span className="duration">{course.duration}</span>
                          <span className="level">{course.level}</span>
                        </div>
                        <p className="description">{course.description}</p>
                        <div className="card-actions">
                          <button className="continue-btn">Continue Learning</button>
                          <button 
                            className="unenroll-btn"
                            onClick={() => handleUnenrollCourse(course.id)}
                          >
                            Unenroll
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-results">
                  {searchTerm
                    ? 'No enrolled courses match your search'
                    : 'You have no enrolled courses yet'}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
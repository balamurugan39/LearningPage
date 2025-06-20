import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import SearchBox from './SearchBox'

const Header = ({ activeTab, setActiveTab, searchQuery, setSearchQuery, onAddCourse }) => {
  return (
    <header className="header">
      <div className="logo-container">
        <img src="/logo.png" alt="Maestrominds Logo" className="logo" />
      </div>

      <SearchBox value={searchQuery} onChange={setSearchQuery} />

      <nav className="nav">
        <button
          className={`nav-link ${activeTab === 'enrolled' ? 'active' : ''}`}
          onClick={() => setActiveTab('enrolled')}
        >
          Enrolled
        </button>
        <button
          className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          Courses
        </button>
        <button className="add-course-btn" onClick={onAddCourse}>
          <FontAwesomeIcon icon={faPlus} /> Add Course
        </button>
        <div className="profile">
          <FontAwesomeIcon icon={faUser} />
        </div>
      </nav>
    </header>
  )
}

export default Header
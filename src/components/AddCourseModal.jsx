import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const AddCourseModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: null
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      thumbnail: URL.createObjectURL(e.target.files[0])
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>Add New Course</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
            {formData.thumbnail && (
              <img 
                src={formData.thumbnail} 
                alt="Preview" 
                className="thumbnail-preview"
              />
            )}
          </div>
          <div className="form-actions">
            <button type="submit">Add Course</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCourseModal
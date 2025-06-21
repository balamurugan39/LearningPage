import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const AddCourseModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailFile: null,
    thumbnailPreview: null
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData({
      ...formData,
      thumbnailFile: file,
      thumbnailPreview: file ? URL.createObjectURL(file) : null
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Create FormData for submission
    const form = new FormData()
    form.append('title', formData.title)
    form.append('description', formData.description)
    if (formData.thumbnailFile) {
      form.append('thumbnail', formData.thumbnailFile)
    }

    onSubmit(form)
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
            {formData.thumbnailPreview && (
              <img 
                src={formData.thumbnailPreview} 
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

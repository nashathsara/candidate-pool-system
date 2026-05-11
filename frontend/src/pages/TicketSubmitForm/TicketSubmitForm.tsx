import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import './TicketSubmitForm.css'

function TicketSubmitForm() {
  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [fileLabel, setFileLabel] = useState('Click to upload or drag and drop')

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFileLabel(file ? file.name : 'Click to upload or drag and drop')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    alert('Support ticket submitted successfully!')
    setSubject('')
    setCategory('')
    setDescription('')
    setFileLabel('Click to upload or drag and drop')
  }

  return (
    <div className="ticket-submit-page">
      <div className="ticket-submit-shell">
        <section className="ticket-submit-intro">
          <h1>Open a Support Ticket</h1>
          <p>
            Our team is here to help you navigate your career journey. Please provide details below.
          </p>
        </section>

        <form className="ticket-submit-card" onSubmit={handleSubmit}>
          <div className="ticket-submit-grid">
            <label className="form-field">
              <span className="field-label">Subject</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Cannot update my resume"
                required
              />
            </label>

            <label className="form-field">
              <span className="field-label">Category</span>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select a category</option>
                <option value="profile">Profile issue</option>
                <option value="application">Application error</option>
                <option value="account">Account access</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          <label className="form-field full-width">
            <span className="field-label">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue you are experiencing in detail..."
              rows={7}
              required
            />
          </label>

          <div className="form-field full-width">
            <span className="field-label">Attach Files</span>
            <label className="upload-dropzone">
              <input
                type="file"
                hidden
                multiple
                accept="image/png,image/jpeg,application/pdf"
                onChange={handleFileChange}
              />
              <div className="upload-inner">
                <div className="upload-icon">☁️</div>
                <div className="upload-copy">
                  <strong>{fileLabel}</strong>
                  <span>PNG, JPG or PDF (max. 10MB)</span>
                </div>
              </div>
            </label>
          </div>

          <div className="actions-row">
            <Link to="/browse" className="cancel-btn">
              Cancel
            </Link>
            <button type="submit" className="submit-btn">
              Submit Ticket
            </button>
          </div>
        </form>

        <section className="knowledge-banner">
          <div className="banner-copy-group">
            <p className="banner-title">Have you checked our Knowledge Base?</p>
            <p className="banner-copy">
              Most common questions about profile corrections and technical issues are answered in our comprehensive help center.
            </p>
          </div>
          <a href="#" className="banner-link">
            WHS Solution ↗
          </a>
        </section>

        <footer className="ticket-submit-footer">
          <span>© 2024 WHS Solution Recruitment Suite. All rights reserved.</span>
          <div className="ticket-submit-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Help Center</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default TicketSubmitForm

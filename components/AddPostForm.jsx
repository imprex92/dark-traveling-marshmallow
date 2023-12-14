import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

const AddPostForm = props => {
    const [activeTab, setActiveTab] = useState('Start')
    const handleTabClick = (tab) => setActiveTab(tab)

  return (
	<div className="step-tab">
      <ul className="cd-breadcrumb triangle nav nav-tabs" role="tablist">
        <li
          role="presentation"
          className={activeTab === 'Start' ? 'active' : ''}
        >
          <a
            href="#Ideate"
            aria-controls="ideate"
            role="tab"
            aria-expanded={activeTab === 'Start'}
            onClick={() => handleTabClick('Start')}
          >
            <span className="material-symbols-outlined">line_start_circle</span>Start
          </a>
        </li>
        <li
          role="presentation"
          className={activeTab === 'Content' ? 'active' : ''}
        >
          <a
            href="#Content"
            aria-controls="content"
            role="tab"
            aria-expanded={activeTab === 'Content'}
            onClick={() => handleTabClick('Content')}
          >
            <span className="material-symbols-outlined">edit_document</span>Add content
          </a>
        </li>
        <li
          role="presentation"
          className={activeTab === 'Image' ? 'active' : ''}
        >
          <a
            href="#Image"
            aria-controls="image"
            role="tab"
            aria-expanded={activeTab === 'Image'}
            onClick={() => handleTabClick('Image')}
          >
            <span className="material-symbols-outlined">attach_file_add</span>Image
          </a>
        </li>
        <li
          role="presentation"
          className={activeTab === 'Submit' ? 'active' : ''}
        >
          <a
            href="#Submit"
            aria-controls="submit"
            role="tab"
            aria-expanded={activeTab === 'Submit'}
            onClick={() => handleTabClick('Submit')}
          >
            <span className="material-symbols-outlined">task_alt</span>Submit
          </a>
        </li>
        {/* Repeat similar li elements for other tabs */}
      </ul>
      <div className="tab-content">
        <div
          role="tabpanel"
          className={`tab-pane ${activeTab === 'Ideate' ? 'active' : ''}`}
          id="Ideate"
        >
          <h3>Ideate a new standard</h3>
        </div>
        <div
          role="tabpanel"
          className={`tab-pane ${activeTab === 'Submit' ? 'active' : ''}`}
          id="Submit"
        >
          <h3>Submit it to Standards organization</h3>
        </div>
        {/* Repeat similar div elements for other tab content */}
      </div>
    </div>
  )
}

AddPostForm.propTypes = {}

export default AddPostForm
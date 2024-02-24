import React, { useState } from 'react'
import styles from 'styles/fileInput.module.scss'
import PropTypes from 'prop-types'

const FileInput = props => {
const [isDragging, setIsDragging] = useState(false)
const [files, setFiles] = useState(null)

const handleDrop = (e) => {
	e.preventDefault();
	e.stopPropagation();
	
	const draggedFiles = e.dataTransfer.files;
	setFiles((prevFiles) => [...prevFiles, ...draggedFiles]);
	setIsDragging(false);
}
const handleChange = (e) => {
	const selectedFiles = e.target.files;
	setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
}

  return (
	<div 
	className={`${styles.fileInput} ${isDragging ? styles.dragging : ''}`}
	onDragOver={(e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}}
	onDragLeave={(e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}}
	onDrop={(e) => {handleDrop(e)}}
	>
		<input 
		className={styles.fileInput}
		multiple 
		capture 
		hidden
		type='file' 
		accept='image/*, video/*' 
		onChange={handleChange(e)}
		/>
		<span className={`material-symbols-outlined ${styles.inputImg}`}>
			edit_document
		</span>
		<label>
			<span className={styles.inputText}>{ isDragging ? 'Drop files here.' : 'Click or drop files here.' }</span>
		</label>
	</div>
  )
}

FileInput.propTypes = {}

export default FileInput
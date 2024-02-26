import React, { useState, useRef } from 'react'
import styles from 'styles/fileInput.module.scss'
import PropTypes from 'prop-types'
import { validateFiles } from 'components/utility/verifyFileInput'

const FileInput = props => {
const [isDragging, setIsDragging] = useState(false)
const [files, setFiles] = useState(null)

const hasValidatedMessage = useRef(false)

const handleDrop = (e) => {
	e.preventDefault();
	e.stopPropagation();
	
	const draggedFiles = e.dataTransfer.files;
	setFiles((prevFiles) => [...prevFiles, ...draggedFiles]);
	setIsDragging(false);
	validation()
}
const handleChange = (e) => {
	const selectedFiles = e.target.files;
	setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
	validation()
}

const validation = () => {
	const validated = validateFiles(files);

	if(validated.message.status === 200){
		console.log(validated.acceptedFiles);
	} else {
		console.log(validated.message.message);
	}
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
			photo_library
		</span>
		<label>
			<span className={styles.inputText}>{ isDragging ? 'Drop the files here.' : 'Click or drop files here.' }</span>
		</label>
	</div>
  )
}

FileInput.propTypes = {}

export default FileInput
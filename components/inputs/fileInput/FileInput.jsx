import React, { useState, useRef, useLayoutEffect } from 'react'
import styles from 'styles/fileInput.module.css'
import PropTypes from 'prop-types'
import { validateFiles } from 'components/utility/verifyFileInput'

const FileInput = props => {
const [isDragging, setIsDragging] = useState(false)
const [files, setFiles] = useState([])
const [validationObject, setValidationObject] = useState(null)

useLayoutEffect (() => {
	if (files && files.length > 0){
		document.getElementById('imgSectionTab').classList.add('hasPreview')
		console.log('files', files);
	}
	else{
		document.getElementById('imgSectionTab').classList.remove('hasPreview')
	}
}, [files])

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
	setValidationObject(null)

	if(validated.message.status === 200){
		console.log(validated.acceptedFiles);
	} else {
		console.log(validated.message.message);
	}
	setValidationObject(validated.message);
}

  return (
	<>
		{validationObject ? <span className={`${styles.inputValidateMsg} ${validationObject.status === 200 ? styles._valid : styles._invalid}`}>{validationObject.message}</span> : null}
		<div 
		className={`${styles.root} ${isDragging ? styles.dragging : ''}`}
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
			name='upload__input'
			id='upload__input'
			className={styles.fileInput}
			multiple 
			capture 
			hidden
			type='file' 
			accept='image/*, video/*' 
			onChange={(e) => handleChange(e)}
			/>
			<label className={styles.inputLabel} htmlFor='upload__input'>
				<span className={`material-symbols-outlined text-white ${styles.inputImg}`}>
					photo_library
				</span>
				<span className={styles.inputText}>
					{ isDragging ? 'Drop the files here.' : 'Drag and drop files here or click here' }
				</span>
			</label>
		</div>
		<div className={styles.filePreviews}>
			{files && files.map((file, index) => (
				<div key={index} className={styles.previewItem}>
					<span className={styles.fileName}>{file.name || '?'}</span>
					<button onClick={() => {
						setFiles((prevFiles) => 
							prevFiles.filter(((_, i) => i !== index))
						)
					}}
					>
						<span className="material-symbols-outlined text-white">
							delete
						</span>
					</button>
				</div>
			))}
		</div>
	</>
  )
}

FileInput.propTypes = {}

export default FileInput
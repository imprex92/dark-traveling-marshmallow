import React, { useState, useRef, useLayoutEffect } from 'react'
import styles from 'styles/fileInput.module.css'
import PropTypes from 'prop-types'
import { validateFiles } from 'components/utility/verifyFileInput'
import Image from 'next/image'

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
console.log(validated);
	if(validated.message.status === 200){
		console.log(validated.acceptedFiles);
	} else {
		console.log(validated.message.message);
	}
	M.toast({text: validated.message.message, displayLength: 2500})
	setValidationObject(validated.message);
}

  return (
	<>
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
				<div key={index} className={`${file.type.startsWith('image/') ? styles.previewItem_img : file.type.startsWith('video/') ? styles.previewItem_vid : styles.previewItem}`}>
					{file.type.startsWith('image/') ? (
						<div className={styles.imgThumbnail}>
							<Image alt='Post image' width={150} height={175} src={URL.createObjectURL(file)} />
						</div>
					) : file.type.startsWith('video/') ? (
						<div className={styles.vidThumbnail}>
							<video controls muted width={300} height={175}>
								<source src={URL.createObjectURL(file)} type={`${file.type === 'video/quicktime' ? 'video/mp4' : file.type}`} />
								No support
							</video>
						</div>
					) : (
						<span className={styles.unknownType}>{file.name || '?'}</span>
					)}
					<button className={`${styles.removeBtn} btn waves-effect waves-light`} onClick={() => {
						setFiles((prevFiles) => 
							prevFiles.filter(((_, i) => i !== index))
						)
					}}
					>
						<span className={`material-symbols-outlined text-white`}>
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
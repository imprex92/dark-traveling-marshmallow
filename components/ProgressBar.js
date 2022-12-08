import {useEffect} from 'react'
import uploadFiles  from "./hooks/useStorage";

function ProgressBar({mainImage, additionalFiles, setUploadedURL, reciptFile, initiator, fireError, isUploading}) {
	console.log(mainImage);
	//console.log(additionalFiles);
	const file = mainImage || reciptFile
	
	//const { url, progress } = uploadFiles(mainImage, initiator)
	const { url, progress, error } = uploadFiles(file, initiator)
	console.log(progress, url);

useEffect(() => {
	if(url){
		setUploadedURL(url)
		isUploading(false)
		fireError(error)
	}
	return () => {

	}
}, [url])

	return (
		<div className="progress-bar">
			progress
			<div className="progress">
				<div className="determinate" style={{width: `${progress}%`}}></div>
			</div>
		</div>
	)
}

export default ProgressBar

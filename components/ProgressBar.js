import {useEffect} from 'react'
import uploadFiles  from "./hooks/useStorage";

function ProgressBar({mainImage, additionalFiles, setPostMainImage, setUploadedURL}) {
	console.log(mainImage);
	console.log(additionalFiles);
	const { url, progress } = uploadFiles(mainImage)
	console.log(progress, url);

useEffect(() => {
	if(url){
		setUploadedURL(url)
		setPostMainImage(null)
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

import PropTypes from 'prop-types';

export const validateFiles = (
	files, 
	allowedTypes, 
	imgUnitMaxSize = 10485760, 
	vidUnitMaxSize = 314572800, 
	totalMaxSize = 314572800
	) => {
	const acceptedFiles = [];
	const rejectedFiles = [];
	allowedTypes = allowedTypes || validateFiles.defaultProps.allowedTypes;
	let totalSize = 0;
	let message = {message: '', status: null};
	for (const file of files) {
		const unitMaxSize = file.type.includes('image/') ? imgUnitMaxSize : vidUnitMaxSize;
		if(allowedTypes.includes(file.type)){
			if(file.size <= unitMaxSize){
				totalSize += file.size;
				acceptedFiles.push(file);
			} else {
				rejectedFiles.push(file);
			}
		}
		if(totalSize <= totalMaxSize){
			continue;
		} else if (totalSize > totalMaxSize) {
			message.message = `Total size of files exceeds the limit (${(totalMaxSize / 1048576).toFixed(0)}MB). One or more files were not added.`;
			message.status = 413;
			break;
		}
		else if(!allowedTypes.includes(file.type)){
			message.message = 'Media type not accepted, only image and video files are allowed.'
			message.status = 415
		}
		else if(file.size < unitMaxSize){
			message.message = 'File too large, file was not added.'
			message.status = 413;
		}
		else{
			message.message = 'Something went wrong'
			message.status = 422;
		}
	}

	if(rejectedFiles.length > 0  && message.status === null){
		message.message = 'One or more files were not accepted, only image and video files are allowed.'
		message.status = 404;
	}
	else{
		message.message = 'All files were accepted.';
		message.status = 200;
	}
	return {acceptedFiles, rejectedFiles, message, totalSize};
}
validateFiles.defaultProps = {
	files: [],
	allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/mpeg', 'video/ogg', 'video/webm', 'video/quicktime', 'video/3gpp', 'video/3gpp2'],
};

validateFiles.propTypes = {
	files: PropTypes.array.isRequired,
	allowedTypes: PropTypes.arrayOf(PropTypes.string),
	totalMaxSize: PropTypes.number.isRequired,
	vidUnitMaxSize: PropTypes.number.isRequired,
	imgUnitMaxSize: PropTypes.number.isRequired,
};

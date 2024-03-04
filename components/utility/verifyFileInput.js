import PropTypes from 'prop-types';

export const validateFiles = (files, allowedTypes, imgUnitMaxSize, vidUnitMaxSize, totalMaxSize) => {
	const acceptedFiles = [];
	const rejectedFiles = [];
	allowedTypes = allowedTypes || validateFiles.defaultProps.allowedTypes;
	vidUnitMaxSize = vidUnitMaxSize || validateFiles.defaultProps.vidUnitMaxSize
	let totalSize = 0;
	let message = {message: '', status: null};
console.log('validation start', files);
	for (const file of files) {
		totalSize += file.size;
		console.log('evening', totalSize);
		if(allowedTypes.includes(file.type)){
			const unitMaxSize = file.type.includes('image') ? imgUnitMaxSize : vidUnitMaxSize;
			if(file.size <= unitMaxSize){
				acceptedFiles.push(file);
				console.log('accepted', file.size, unitMaxSize);
			} else {
				rejectedFiles.push(file);
				console.log('reject', file.size, unitMaxSize);
			}
		}
		if(totalSize <= totalMaxSize){
			acceptedFiles.push(file)
		} else {
			rejectedFiles.length = 0;
			message.message = `Total size of files exceeds the limit (${(totalMaxSize / 1048576).toFixed(0)}MB). One or more files were not added.`;
			message.status = 413;
			break;
		}
	}

	if(rejectedFiles.length > 0){
		message.message = 'One or more files were not accepted, only image and video files are allowed.'
		message.status = 404;
	}
	else{
		message.message = 'All files were accepted.';
		message.status = 200;
console.log('200');
	}
	return {acceptedFiles, rejectedFiles, message, totalSize};
}
validateFiles.defaultProps = {
	files: [],
	allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/mpeg', 'video/ogg', 'video/webm', 'video/quicktime', 'video/3gpp', 'video/3gpp2'],
	totalMaxSize: 314572800,
	imgUnitMaxSize: 10485760,
	vidUnitMaxSize: 314572800,
};

validateFiles.propTypes = {
	files: PropTypes.array.isRequired,
	allowedTypes: PropTypes.arrayOf(PropTypes.string),
	totalMaxSize: PropTypes.number.isRequired,
	vidUnitMaxSize: PropTypes.number.isRequired,
	imgUnitMaxSize: PropTypes.number.isRequired,
};

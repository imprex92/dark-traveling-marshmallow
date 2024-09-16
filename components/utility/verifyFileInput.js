import PropTypes from 'prop-types'
import {
  FILE_TYPE_VIDEOS_IMAGES,
  IMG_UNIT_MAX_SIZE,
  TOTAL_MAX_SIZE,
  VID_UNIT_MAX_SIZE,
} from './constants'

export const validateFiles = (
  files = [],
  allowedTypes = FILE_TYPE_VIDEOS_IMAGES,
  imgUnitMaxSize = IMG_UNIT_MAX_SIZE,
  vidUnitMaxSize = VID_UNIT_MAX_SIZE,
  totalMaxSize = TOTAL_MAX_SIZE,
) => {
  const acceptedFiles = []
  const rejectedFiles = []
  let totalSize = 0
  let message = { message: '', status: null }
  for (const file of files) {
    const unitMaxSize = file.type.includes('image/')
      ? imgUnitMaxSize
      : vidUnitMaxSize
    if (allowedTypes.includes(file.type)) {
      if (file.size <= unitMaxSize) {
        totalSize += file.size
        acceptedFiles.push(file)
      } else {
        rejectedFiles.push(file)
      }
    }
    if (totalSize <= totalMaxSize) {
      continue
    } else if (totalSize > totalMaxSize) {
      message.message = `Total size of files exceeds the limit (${(totalMaxSize / 1048576).toFixed(0)}MB). One or more files were not added.`
      message.status = 413
      break
    } else if (!allowedTypes.includes(file.type)) {
      message.message =
        'Media type not accepted, only image and video files are allowed.'
      message.status = 415
    } else if (file.size < unitMaxSize) {
      message.message = 'File too large, file was not added.'
      message.status = 413
    } else {
      message.message = 'Something went wrong'
      message.status = 422
    }
  }

  if (rejectedFiles.length > 0 && message.status === null) {
    message.message =
      'One or more files were not accepted, only image and video files are allowed.'
    message.status = 404
  } else {
    message.message = 'All files were accepted.'
    message.status = 200
  }
  return { acceptedFiles, rejectedFiles, message, totalSize }
}

validateFiles.propTypes = {
  files: PropTypes.array.isRequired,
  allowedTypes: PropTypes.arrayOf(PropTypes.string),
  totalMaxSize: PropTypes.number.isRequired,
  vidUnitMaxSize: PropTypes.number.isRequired,
  imgUnitMaxSize: PropTypes.number.isRequired,
}

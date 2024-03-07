import React from 'react'
import styles from 'styles/postSummary.module.css'
import PropTypes from 'prop-types'

const PostSummary = props => {
	const { formData } = props
	console.log(formData);
	return (
		<div>PostSummary</div>
  	)
}

PostSummary.propTypes = {}

export default PostSummary
import React from 'react'
import styles from 'styles/postSummary.module.css'
import Slider from 'components/imgSlider/Slider'

const PostSummary = props => {
	const { formData } = props
	console.log(formData);

	if(formData.files?.length === 0 || !formData.files) return  <div>No images found</div>;

	return (
		<div className={styles.root}>
			<Slider formData={formData} />
		</div>
	)
}

export default PostSummary
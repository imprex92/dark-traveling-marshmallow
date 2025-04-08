import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { RANDOM_SENTENCES } from 'components/utility/constants'
import PropTypes from 'prop-types'
import styles from 'styles/addFirstPost.module.css'

const AddFirstPost = ({isDashboard = false}) => {
	const route = useRouter()
	const redirect = () => route.push('/user/newpost')
	const [randomIndex, setRandomIndex] = useState(0)
	
	useEffect(() => {
		const randomIndex = Math.floor(Math.random() * RANDOM_SENTENCES.length)
		setRandomIndex(randomIndex)
	  }, [])

	return (
	  <div style={{gridArea: 'wrap'}} onClick={redirect} className={`${styles.noPostsRoot} ${isDashboard ? styles.onDashboard : styles.elseWhere}`}>
		<div className={styles.noPostContainer}>
		  <h5 className={styles.sentence}>{RANDOM_SENTENCES[randomIndex]}</h5>
		  <span className={`material-symbols-outlined ${styles.noPostIcon}`}>
			edit_document
		  </span>
		</div>
	  </div>
	)
}

AddFirstPost.propTypes = {
	isDashboard: PropTypes.bool
}

export default AddFirstPost
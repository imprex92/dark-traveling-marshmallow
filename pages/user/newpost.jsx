import StorageCommunicator_copy from 'components/communications/StorageCommunicator_copy'
import withPrivateRoute from 'components/HOC/withPrivateRoute'
import StorageCommunicator from 'components/communications/StorageCommunicator'
import styles from 'styles/newPost.module.css'

const newpost = ({userAuth}) => {
	return (
		<div>
			<img
			className={styles.newpostImg}
			src="/assets/iceland-5104385_1920.jpeg"
			alt="Beautiful nature"
			layout="fill"
			objectfit="fit"
			objectposition="center bottom"
			quality={75}
			
			/>
			{/* <StorageCommunicator userAuth={userAuth}/> */}
			<StorageCommunicator_copy userAuth={userAuth} />
		</div>
	)
}

export default withPrivateRoute(newpost)
import withPrivateRoute from '../../components/HOC/withPrivateRoute'
import StorageCommunicator from '../../components/communications/StorageCommunicator'

const newpost = ({userAuth}) => {
	return (
		// !! navigation ner required! Already included in imported StorageCommunicator-file!
		<div>
			<img
			className="newpost-img"
			src="/assets/iceland-5104385_1920.jpeg"
			alt="Beautiful nature"
			layout="fill"
			objectfit="fit"
			objectposition="center bottom"
			quality={75}
			
			/>
			<StorageCommunicator userAuth={userAuth}/>
		</div>
	)
}

newpost.getInitialProps = async props => {
	// console.info('##### Congratulations! You are authorized! ######', props);
	return {};
};

export default withPrivateRoute(newpost)
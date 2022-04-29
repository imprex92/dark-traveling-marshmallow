import React from 'react'
import withPrivateRoute from '../../components/HOC/withPrivateRoute'

const settings = ({userAuth}) => {
	return (
		<div>
			<p>this is settings page - Under construction!</p>
		</div>
	)
}
settings.getInitialProps = async props => {
	// console.info('##### Congratulations! You are authorized! ######', props);
	return {};
};

export default withPrivateRoute(settings)

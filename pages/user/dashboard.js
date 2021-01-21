import React from 'react'
import Dashboard from '../../components/Dashboard'
import Sidenav from '../../components/nav/sidenav'
import withPrivateRoute from '../../components/HOC/withPrivateRoute'

const dashboard = () => {
	return (
		<>
			<Sidenav/>
			<Dashboard/>
		</>
	)
}

dashboard.getInitialProps = async props => {
	console.info("### Yay! you're Authorized!", props);
	return {}
}

export default withPrivateRoute(dashboard)


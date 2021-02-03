import React from 'react'
import Dashboard from '../../components/Dashboard'
import Sidenav from '../../components/nav/sidenav'
import withPrivateRoute from '../../components/HOC/withPrivateRoute'

const dashboard = () => {
	return (
		<div className="dashboard-main">
			
			<Sidenav/>
			<Dashboard/>
			
		</div>
	)
}

// dashboard.getInitialProps = async props => {
// 	console.info("### Yay! you're Authorized!", props);
// 	return {}
// }

export default dashboard
// withPrivateRoute(dashboard)


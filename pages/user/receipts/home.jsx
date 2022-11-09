import React from 'react'
import withPrivateRoute from 'components/HOC/withPrivateRoute'
import SideNavLight from 'components/nav/SideNavLight'

const receiptHome = () => {
  return (
	<div className='dashboard-main'>
    <SideNavLight />
  </div>
  )
}

export default withPrivateRoute(receiptHome)

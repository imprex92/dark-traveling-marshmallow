import React from 'react'
import withPrivateRoute from '../../components/HOC/withPrivateRoute'
import { projectFirestore } from 'firebase/config'
import styles from 'styles/settingsPage.module.css'

const settings = ({userAuth, userData}) => {
	console.log('setting userData', userAuth, userData);

	const UserLogedIn = () => {
		return (userAuth ? <p>Hello User</p> : <p>You need to be logged in</p>)
	}

	return (
		<div className={styles.main}>
			<section><UserLogedIn /></section>
			<aside className={styles.sidePanel}>
				<span>Tris is the sidemenu</span>
			</aside>
		</div>
	)
}
settings.getInitialProps = async props => {
	const userDataRef = projectFirestore.collection('testUserCollection').doc(props.auth.uid)
	
	const userData = await userDataRef.get()
	.then(docSet => {
		if (docSet.exists) {
			return docSet.data()
		} else{
			return null
		}
	})
	.catch(err => {
		console.error('Error getting document', err)
	})
	

	return {userData};
};

export default withPrivateRoute(settings)

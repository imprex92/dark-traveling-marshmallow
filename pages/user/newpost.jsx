import withPrivateRoute from 'components/HOC/withPrivateRoute'
import { useAuth } from 'contexts/AuthContext'

import styles from 'styles/newPost.module.css'

import AddPostForm from 'components/postForm/AddPostForm'
import SideNav from 'components/nav/sidenav'

const newpost = () => {
	const { currentUser } = useAuth()

	return (
		<div style={{overflow: "hidden"}}>
			<img
			className={styles.newpostImg}
			src="/assets/iceland-5104385_1920.jpeg"
			alt=""
			fill="true"
			style={{objectFit: "cover"}}
			quality={75}
			/>

			<div id={styles.newPostForm} className={styles.main}>
				<div className={styles.navigation}>
					<SideNav dbUserData={currentUser}/>
				</div>
				<div className={styles.content}>
					<AddPostForm dbUserData={currentUser} />
				</div>
			</div>
			<style>{`
			.sidenav-overlay{
				width: calc(100% - 300px);
				margin-left: auto;
			}
			`}</style>
		</div>
	)
}

export default withPrivateRoute(newpost)

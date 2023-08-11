import React, {useEffect} from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Login from '../components/login'
import {projectAuth} from '../firebase/config'
import { useAuth } from '../contexts/AuthContext' 


function login({userAuth}) {
	const {currentUser} = useAuth()
	const router = useRouter()
	useEffect(() => {
		if(currentUser){
			router.push('/user/dashboard') 
		}
	}, [currentUser])
	return (
		<>
			<img
			loading='eager'
			className="login-img"
			src="/assets/simon-migaj.jpg"
			alt="Picture of the author"
			layout="fill"
			objectfit="cover"
			objectposition="center bottom"
			quality={75}		
			/>
			{!currentUser && <Login/>}
		</>
	)
}
// login.getInitialProps = async props => {
// 	console.info('##### Congratulations! You are authorized! ######', props);
// 	return {};
// };

export default login
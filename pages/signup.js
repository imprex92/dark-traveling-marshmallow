import React, {useEffect} from 'react'
import Image from 'next/image'
import Signup from '../components/signup'
import {projectAuth} from '../firebase/config'
import {useRouter} from 'next/router'
import { useAuth } from '../contexts/AuthContext' 

function signup({userAuth}) {
	const {currentUser} = useAuth()
	const router = useRouter()
	useEffect(() => {
		router.prefetch('/user/dashboard')
		if(currentUser){
			router.push('/user/dashboard') 
		}
	}, [])
	return (
		<>
			<img
			className="signUp-img"
			src="/assets/simon-migaj.jpg"
			alt="Picture of the author"
			layout="fill"
			objectfit="cover"
			objectposition="center bottom"
			quality={75}		
			/>
			{!currentUser && <Signup/>}
		</>
	)
}
// signup.getInitialProps = async props => {
// 	console.info('##### Congratulations! You are authorized! ######', props);
// 	return {};
// };

export default signup

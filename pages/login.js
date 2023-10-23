import React, {useEffect} from 'react'
import { useRouter } from 'next/router'
import Image from "next/legacy/image"
import Login from '../components/login'
import {projectAuth} from '../firebase/config'
import { useAuth } from '../contexts/AuthContext' 
import imageAsset from 'public/assets/simon-migaj.jpg'
import styles from 'styles/useGateway.module.css'

function login() {
	const {currentUser} = useAuth()
	const router = useRouter()
	useEffect(() => {
		if(currentUser){
			router.push('/user/dashboard') 
		}
	}, [currentUser])

	return (
		<>
			<Image
			priority={true}
			loading='eager'
			className={styles.backgroundImage}
			src={imageAsset}
			alt="Picture of the author"
			layout="fill"
			objectFit="cover"
			quality={75}		
			/>
			{!currentUser && <Login/>}
		</>
	)
}

export default login
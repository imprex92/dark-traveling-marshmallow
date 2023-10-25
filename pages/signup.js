import React, {useEffect} from 'react'
import Image from "next/image"
import Signup from '../components/signup'
import {projectAuth} from '../firebase/config'
import {useRouter} from 'next/router'
import { useAuth } from '../contexts/AuthContext' 
import imageAsset from 'public/assets/simon-migaj.jpg'
import styles from 'styles/useGateway.module.css'

function signup() {
	const {currentUser} = useAuth()
	const router = useRouter()

	useEffect(() => {
		router.prefetch('/user/dashboard')
		if(currentUser){
			router.push('/user/dashboard') 
		}
	}, [])

	return <>
        <Image
            priority={true}
            loading='eager'
            className={styles.backgroundImage}
            src={imageAsset}
            alt="Picture of the author"
            quality={75}
            fill
            placeholder='blur'
            sizes="100vw"
            style={{
                objectFit: "cover"
            }} />
        {!currentUser && <Signup/>}
    </>;
}

export default signup

import React from 'react'
import Image from 'next/image'
import Login from '../components/login'


function login() {
	return (
		<>
			<Image
			className="login-img"
			src="/assets/simon-migaj.jpg"
			alt="Picture of the author"
			layout="fill"
			objectfit="cover"
			objectposition="center bottom"
			quality={75}		
			/>
			<Login/>
		</>
	)
}

export default login

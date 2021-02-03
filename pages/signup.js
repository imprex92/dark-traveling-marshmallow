import React from 'react'
import Image from 'next/image'
import Signup from '../components/signup'


function signup() {
	return (
		<>
			<Image
			className="signUp-img"
			src="/assets/simon-migaj.jpg"
			alt="Picture of the author"
			layout="fill"
			objectfit="cover"
			objectposition="center bottom"
			quality={75}		
			/>
			<Signup/>
		</>
	)
}

export default signup

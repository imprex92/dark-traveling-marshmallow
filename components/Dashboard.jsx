import React, {useState} from 'react'
import { useAuth } from '../../contexts/AuthContext'

function Dashboard() {
	const { currentUser } = useAuth();
	const [userName, setUsername] = useState(currentUser.displayName);
	const [ userAvatarURL, setUserAvatarURL ] = useState(currentUser.photoURL)

	async function handleUpdateUser(e){
		e.preventDefault()
	}



	return (
		<div>
			
		</div>
	)
}

export default Dashboard

//  currentUser från authContext
//  projectAuth + projectDatabas från ../firebase/config
//  kolla om currentUser är inloggad
// currentUser.uid ska läggas till för varje användare och vara namnet på "collection"
import React from 'react'
import { projectFirestore } from "../firebase/config.js"
import { useAuth } from '../../contexts/AuthContext'

function databaseContext() {
const { currentUser } = useAuth()
	return (
		<div>
			
		</div>
	)
}

export default databaseContext

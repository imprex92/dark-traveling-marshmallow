import Router from 'next/router';
import React from 'react'
import { projectAuth } from '../../firebase/config';



const login = '/login?redirected=true';

// /**
// * Check user authentication and authorization
// * It depends on you and your auth service provider.
// // * @returns {{auth: null}}
// */


const checkUserAuthentication = async () => {
	
	// return currentUser
	return projectAuth.currentUser
}

export default WrappedComponent => {
	
	const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
	
	hocComponent.getInitialProps = async (context) => {
		const userAuth = await checkUserAuthentication();
		// console.log(userAuth);
		// Are you really allowed here?
		if(!userAuth){
			// Handle server-side and client-side rendering
			if(context.res){
				context.res?.writeHead(302, {
					location: login,
				});
				context.res?.end();
			} else{
				Router.replace(login);
			}
		} else if(WrappedComponent.getInitialProps){
			const wrappedProps = await WrappedComponent.getInitialProps({...context, auth: userAuth});
			return { ...wrappedProps, userAuth};
		}

		return {userAuth}
	}
	return hocComponent;
}
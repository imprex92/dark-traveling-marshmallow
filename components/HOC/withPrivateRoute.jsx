import React, { useEffect } from 'react';
import Router from 'next/router';
import { projectAuth } from '../../firebase/config';
import { getCookie } from '../utility/CookieHandler';

const login = '/login?redirected=true';

// Function to check user authentication
const checkUserAuthentication = async () => {
  const user = projectAuth.currentUser;
  return user;
};

const withAuthentication = (WrappedComponent) => {
  const AuthenticatedComponent = ({ userAuth, ...props }) => {
    // Read the NEXT_AUTH_ENABLE environment variable
    const nextAuthEnable = process.env.NEXT_AUTH_ENABLE !== 'false';

    // If NEXT_AUTH_ENABLE is false, return the WrappedComponent directly with userAuth
    if (!nextAuthEnable) {
      return <WrappedComponent {...props} userAuth={userAuth} />;
    }

    // Render the wrapped component if user is authenticated
    if (userAuth) {
      return <WrappedComponent {...props} userAuth={userAuth} />;
    }

    // Redirect to the login page if user is not authenticated
    return null;
  };

  AuthenticatedComponent.getInitialProps = async (context) => {
    // Read the NEXT_AUTH_ENABLE environment variable
    const nextAuthEnable = process.env.NEXT_AUTH_ENABLE !== 'false';

    // If NEXT_AUTH_ENABLE is false, return an empty object with userAuth
    if (!nextAuthEnable) {
      return { userAuth: null };
    }

    const userAuth = await checkUserAuthentication();

    if (!userAuth) {
      // User is not authenticated, redirect
      if (context.res) {
        context.res.writeHead(302, { Location: login });
        context.res.end();
      } else {
        Router.replace(login);
      }
    }

    // If WrappedComponent has getInitialProps, call it
    if (WrappedComponent.getInitialProps) {
      /*const additionalData = {
        latestPosition: getCookie('latestLocation') || null,
      };*/

      const wrappedProps = await WrappedComponent.getInitialProps({
        ...context,
        auth: userAuth,
       // additional: additionalData,
      });

      return { ...wrappedProps, userAuth };
    }

    return { userAuth };
  };

  return AuthenticatedComponent;
};

export default withAuthentication;

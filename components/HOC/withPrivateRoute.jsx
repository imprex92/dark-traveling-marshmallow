import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { projectAuth } from '../../firebase/config';

const login = '/login?redirected=true';

// Function to check user authentication
export const checkAuthState = async () => {
  return new Promise((resolve, reject) => {
    projectAuth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
};

const withAuthentication = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const [userAuth, setUserAuth] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      setIsLoading(true);
      const fetchUserAuth = async () => {
        try {
          const user = await checkAuthState();
          setUserAuth(user);
          setIsLoading(false);
        } catch (error) {
          console.error('Error checking authentication:', error);
        }
      };

      fetchUserAuth();
    }, []);

    if (!isLoading && userAuth) {
      // If authenticated, pass the `user` prop to the component and render it
      return (
        <WrappedComponent
          {...props}
          isLoading={isLoading}
          userAuth={userAuth}
          today={new Date()}
        />
      );
    } else if (!isLoading && !userAuth) {
      router.replace(login);
    }
    // Render the WrappedComponent with userAuth once it's fetched
    return null;
  };

  return AuthenticatedComponent;
};

export default withAuthentication;

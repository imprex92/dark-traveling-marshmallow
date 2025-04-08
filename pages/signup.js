import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import imageAsset from 'public/assets/simon-migaj.jpg';
import styles from 'styles/useGateway.module.css';

import Signup from '../components/signup';
import { projectAuth } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

function signup() {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.prefetch('/user/dashboard');
    if (currentUser) {
      router.push('/user/dashboard');
    }
  }, []);

  return (
    <>
      <Image
        priority={true}
        loading="eager"
        className={styles.backgroundImage}
        src={imageAsset}
        alt="Picture of the author"
        quality={75}
        fill="true"
        placeholder="blur"
        sizes="100vw"
        style={{
          objectFit: 'cover',
        }}
      />
      {!currentUser && <Signup />}
    </>
  );
}

export default signup;

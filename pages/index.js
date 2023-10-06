import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import Image from 'next/image';
import styles from 'styles/startpage.module.css'
import Link from 'next/link';

//TODO redo startpage

export default function Home(props) {
  const router = useRouter()
  const headerText = 'Dark Marshmallow'
  const btnText = 'Get started'
  const smallHeader = 'Your travel companion app'

  useEffect(() => {
    //router.push('/login')
    if(typeof window !== 'undefined'){
      const M = require('../js/materialize');
      var sidenav = document.querySelectorAll(".sidenav");
      M.Sidenav.init(sidenav, {});
      
        var elems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(elems, {});
      
      
    }
  }, [ ]);
 
  return (
    <div className={styles.root}>
        <Image layout='fill' objectPosition={'top right'} objectFit='cover' src={'/assets/overview_tokyo_orginal.webp'} priority={true} alt='Overlook Tokyo'/>
        <div className={styles.container}>
            <h5 className={styles.miniHeader}>{smallHeader}</h5>
            <div>
                <div className={styles.headerContainer}>
                    <h2 className={styles.header}>
                        <span className={styles.iconContainer}>         
                            {headerText}
                        </span>
                        <span className={`material-symbols-outlined ${styles.icon}`}>
                            travel
                        </span>
                    </h2>
                </div>
            </div>
            <Link href={'/login'}>{btnText}</Link>
        </div>
    </div>
  );
}

export async function getServerSideProps() {
  return { props: { ssrWorking: true } };
}
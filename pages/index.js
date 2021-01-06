// import Head from 'next/head'
// import styles from '../styles/Home.module.css'

// export default function Home() {
//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>Create Next App</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className={styles.main}>
//         <h1 className={styles.title}>
//           Welcome to <a href="https://nextjs.org">Next.js!</a>
//         </h1>

//         <p className={styles.description}>
//           Get started by editing{' '}
//           <code className={styles.code}>pages/index.js</code>
//         </p>

//         <div className={styles.grid}>
//           <a href="https://nextjs.org/docs" className={styles.card}>
//             <h3>Documentation &rarr;</h3>
//             <p>Find in-depth information about Next.js features and API.</p>
//           </a>

//           <a href="https://nextjs.org/learn" className={styles.card}>
//             <h3>Learn &rarr;</h3>
//             <p>Learn about Next.js in an interactive course with quizzes!</p>
//           </a>

//           <a
//             href="https://github.com/vercel/next.js/tree/master/examples"
//             className={styles.card}
//           >
//             <h3>Examples &rarr;</h3>
//             <p>Discover and deploy boilerplate example Next.js projects.</p>
//           </a>

//           <a
//             href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//           >
//             <h3>Deploy &rarr;</h3>
//             <p>
//               Instantly deploy your Next.js site to a public URL with Vercel.
//             </p>
//           </a>
//         </div>
//       </main>

//       <footer className={styles.footer}>
//         <a
//           href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Powered by{' '}
//           <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
//         </a>
//       </footer>
//     </div>
//   )
// }



import React, { useState, useEffect } from 'react';

export default function Home(props) {
  useEffect(() => {
    if(typeof window !== 'undefined'){
      const M = require('materialize-css');
      var sidenav = document.querySelectorAll(".sidenav");
      M.Sidenav.init(sidenav, {});
      
        var elems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(elems, {});
      
      
    }
  }, [ ]);
 
  return (
    <>
      {props.ssrWorking ? (
        
        <div>
          <img src="/assets/success.jpg" height="500" />
          <h2> Deployment Successful of Nextjs Application with SSR on Firebase. </h2>
          <a className="waves-effect waves-light btn">button</a>
          <a className="waves-effect waves-light btn"><i className="material-icons left">cloud</i>buttohghghn</a>
        
  <a className='dropdown-trigger btn' href='#' data-target='dropdown1'>Drop Me!</a>

  
  <ul id='dropdown1' className='dropdown-content'>
    <li><a href="#!">one</a></li>
    <li><a href="#!">two</a></li>
    <li className="divider" tabIndex="-1"></li>
    <li><a href="#!">three</a></li>
    <li><a href="#!"><i className="material-icons">view_module</i>four</a></li>
    <li><a href="#!"><i className="material-icons">cloud</i>five</a></li>
  </ul>

  <nav> hu </nav>

<ul id="slide-out" className="sidenav">
  <li><div className="user-view">
    <div className="background">
      <img src="images/office.jpg"/>
    </div>
    <a href="#user"><img className="circle" src="images/yuna.jpg"/></a>
    <a href="#name"><span className="white-text name">John Doe</span></a>
    <a href="#email"><span className="white-text email">jdandturk@gmail.com</span></a>
  </div></li>
  <li><a href="#!"><i className="material-icons">cloud</i>First Link With Icon</a></li>
  <li><a href="#!">Second Link</a></li>
  <li><div className="divider"></div></li>
  <li><a className="subheader">Subheader</a></li>
  <li><a className="waves-effect" href="#!">Third Link With Waves</a></li>
</ul>
<a href="#" data-target="slide-out" className="sidenav-trigger"><i className="material-icons">menu</i></a>
        </div>
      ) : (
        <h2>SSR not working</h2>
      )}
    </>
  );
}

export async function getServerSideProps() {
  return { props: { ssrWorking: true } };
}
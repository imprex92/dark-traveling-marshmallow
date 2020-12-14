import Head from 'next/head'
import '../styles/globals.css'

function MyApp({Component,pageProps}) {
  return (
      <>
          <Head>
              <script 
                  src="https://code.jquery.com/jquery-3.5.1.slim.min.js" 
                  crossorigin="anonymous"
                  />
                  {/* <!-- Firebase App (the core Firebase SDK) is always required and must be listed first --> */}
              <script src="/__/firebase/8.1.2/firebase-app.js"></script>

              {/* <!-- If you enabled Analytics in your project, add the Firebase SDK for Analytics --> */}
              <script src="/__/firebase/8.1.2/firebase-analytics.js"></script>

              {/* <!-- Add Firebase products that you want to use --> */}
              <script src="/__/firebase/8.1.2/firebase-auth.js"></script>
              <script src="/__/firebase/8.1.2/firebase-firestore.js"></script>
              <script src="/__/firebase/8.1.2/firebase-storage.js"></script>
              {/* <!-- Initialize Firebase --> */}
              <script src="/__/firebase/init.js"></script>
          </Head>
          <Component {...pageProps}/>
      </>
  );
}

export default MyApp;




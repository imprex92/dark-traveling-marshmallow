import Document, { Html, Head, Main, NextScript } from 'next/document'
require('dotenv').config()

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          {/* <!-- Firebase App (the core Firebase SDK) is always required and must be listed first --> */}
			    {/* <script src="/__/firebase/8.1.2/firebase-app.js"></script> */}
          <script  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCZt0vlObs4uTbyW87Qm2zBnuBBllmnf5A&libraries=places"></script>

          {/* <!-- If you enabled Analytics in your project, add the Firebase SDK for Analytics --> */}
          {/* <script src="/__/firebase/8.1.2/firebase-analytics.js"></script> */}

          {/* <!-- Add Firebase products that you want to use --> */}
          {/* <script src="/__/firebase/8.1.2/firebase-auth.js"></script>
          <script src="/__/firebase/8.1.2/firebase-firestore.js"></script>
          <script src="/__/firebase/8.1.2/firebase-storage.js"></script> */}
          
          {/* <!-- Initialize Firebase --> */}
          {/* <script src="/__/firebase/init.js"></script> */}
        </body>
      </Html>
    )
  }
}

export default MyDocument

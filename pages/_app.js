import Head from 'next/head'
import '../styles/globals.css'
import '../styles/materialize.css'


function MyApp({Component,pageProps}) {
  return (
	  <>
		<Head>
			<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
			{/* <link type="text/css" rel="stylesheet" href="../styles/materialize.css"  media="screen,projection"/> */}
			<meta name="viewport" content="width=device-width, initial-scale=1"></meta>
			<script 
				src="https://code.jquery.com/jquery-3.5.1.slim.min.js" 
				crossOrigin="anonymous"
				/>
				
		</Head>
		<Component {...pageProps}/>
	  </>
  );
}

export default MyApp;




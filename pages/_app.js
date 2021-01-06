import Head from 'next/head'
import { AuthProvider } from '../contexts/AuthContext'
import '../styles/globals.css'
import '../styles/materialize.css'

if(typeof window !== 'undefined'){
	require( '../js/materialize')
	}

function MyApp({Component,pageProps}) {
  return (
	  <>
	  	<AuthProvider>
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
		</AuthProvider>
	  </>
  );
}

export default MyApp;




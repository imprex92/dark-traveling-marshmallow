import Head from 'next/head'
import { AuthProvider } from '../contexts/AuthContext'
import { DatabaseProvider } from '../contexts/DatabaseContext'
import '../styles/globals.css'
import '../styles/materialize.css'
import '../styles/signin.style.css'
import '../styles/dashboard.style.css'
import '../styles/slides-component.style.scss'
import '../styles/blogPost-page.style.css'
import '../styles/sideNav.style.css'
import '../styles/singlePost.style.css'
import '../styles/weather.style.css'

if(typeof window !== 'undefined'){
	require( '../js/materialize')
	}

	//TODO check if jquery is really needed!

function MyApp({Component,pageProps}) {
  return (
	  <>
	  	<AuthProvider>
			{/* <DatabaseProvider> */}
				<Head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1"></meta>
				</Head>
				<Component {...pageProps}/>
			{/* </DatabaseProvider> */}
		</AuthProvider>
	  </>
  );
}

export default MyApp;

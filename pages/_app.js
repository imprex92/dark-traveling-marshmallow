import Head from 'next/head'
import Script from 'next/script'
import { lazy } from 'react'
import { AuthProvider } from 'contexts/AuthContext'
import { DatabaseProvider } from 'contexts/DatabaseContext'
import 'styles/global.style.css'
import 'styles/materialize.css'
import 'styles/signin.style.css'
import 'styles/dashboard.style.css'
import 'styles/slides-component.style.scss'
import 'styles/blogPost-page.style.css'
import 'styles/sideNav.style.css'
import 'styles/singlePost.style.css'
import 'styles/weather.style.css'
import useSiteSettings from 'store/siteSettings';
import {useRouter} from 'next/router';
const WeatherWidget = lazy(() => import('components/widgets/WeatherWidget'))

if(typeof window !== 'undefined'){
	require( 'js/materialize')
	}

	//TODO check if jquery is really needed!

function MyApp({Component,pageProps}) {
	const widgetProhibited = ['/login', '/signup', '/']
	const router = useRouter()
	const { showWeaterWidget } = useSiteSettings(state => state.data)

  return (
	  <>
	  	<AuthProvider>
			{/* <DatabaseProvider> */}
				<Head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1"></meta>
				</Head>
				<Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.PROJECT_FIREBASE_MEASUREMENT_ID}`}/>
				<Script
				id='google-analytics'
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
				__html: `
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', '${process.env.PROJECT_FIREBASE_MEASUREMENT_ID}', {
				page_path: window.location.pathname,
				});
				`,
				}}
				/>
				{ showWeaterWidget && !widgetProhibited.includes(router.pathname) ? <WeatherWidget /> : null}
				<Component {...pageProps}/>
			{/* </DatabaseProvider> */}
		</AuthProvider>
	  </>
  );
}

export default MyApp;

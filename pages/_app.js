import Head from 'next/head'
import Script from 'next/script'
import { lazy, useEffect } from 'react'
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
import { useOnlineStatus } from 'components/hooks/useOnlineStatus'
import OfflineComp from 'components/OfflineComp'
const WeatherWidget = lazy(() => import('components/widgets/WeatherWidget'))

if(typeof window !== 'undefined'){
	require( 'js/materialize')
	}

	//TODO check if jquery is really needed!

function MyApp({Component,pageProps}) {
	const widgetProhibited = ['/login', '/signup', '/']
	const router = useRouter()
	const { showWeaterWidget } = useSiteSettings(state => state.data)
	const isOnline = useOnlineStatus()

	useEffect(() => {

	}, [])

  return (
	  <>
	  	<AuthProvider>
			{/* <DatabaseProvider> */}
				<Head>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1"></meta>
				</Head>
				<Script id="google-tag-manager" strategy="afterInteractive">
					{`
						(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
						new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
						j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
						'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
						})(window,document,'script','dataLayer','${process.env.GTM_ID}');
					`}
				</Script>
				<Script strategy="afterInteractive" id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="f5fc7d0f-f0b3-46eb-b262-434f483563e1" type="text/javascript" async/>
				<Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.PROJECT_FIREBASE_MEASUREMENT_ID}`}/>
				<Script
				data-cookieconsent="statistics"
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
					{ isOnline && showWeaterWidget && !widgetProhibited.includes(router.pathname) ? <WeatherWidget /> : null}
					{ isOnline ? <Component {...pageProps}/> : <OfflineComp />}
			{/* </DatabaseProvider> */}
		</AuthProvider>
	  </>
  );
}

export default MyApp;

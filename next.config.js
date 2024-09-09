//const { StatsWriterPlugin } = require('webpack-stats-plugin');

module.exports = {
	experimental: {
		turbo: {
		  rules: {
			'*.svg': {
			  loaders: ['@svgr/webpack'],
			  as: '*.js',
			},
		  },
		},
	  },
	serverRuntimeConfig: {
		type:  process.env.ADMIN_FIREBASE_TYPE,
		project_id: process.env.ADMIN_FIREBASE_PROJECT_ID,
		private_key_id: process.env.ADMIN_FIREBASE_PRIVATE_KEY_ID,
		private_key: process.env.ADMIN_FIREBASE_PRIVATE_KEY,
		client_email: process.env.ADMIN_FIREBASE_CLIENT_EMAIL,
		client_id: process.env.ADMIN_FIREBASE_CLIENT_ID,
		auth_uri: process.env.ADMIN_FIREBASE_AUTH_URI,
		token_uri: process.env.ADMIN_FIREBASE_TOKEN_URI,
		auth_provider_x509_cert_url: process.env.ADMIN_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
		client_x509_cert_url: process.env.ADMIN_FIREBASE_CLIENT_X509_CERT_URL,
		univers_domain: process.env.ADMIN_FIREBASE_UNIVERSE_DOMAIN,
		databaseURL: process.env.NEXT_PUBLIC_PROJECT_FIREBASE_DATABASE_URL,
	},  // Will be available on server
	publicRuntimeConfig: {}, // Will be available on both server and client

	images: {
		//domains: [
		//	'firebasestorage.googleapis.com',
		//	'lh3.googleusercontent.com',
		//	'photos.app.goo.gl', 
		//	'via.placeholder.com',
		//	'dark-traveling-marshmallow.web.app'
		//],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'photos.app.goo.gl',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'via.placeholder.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'dark-traveling-marshmallow.web.app',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				pathname: '/**',
			},
		],
	},
	webpack(config, { isServer }) {
		config.node = { 
			global: true,
			__filename: true,
			__dirname: true, 
		}
		if (!isServer) {
			config.resolve.fallback.fs = false;
		}
		config.plugins.push(
			//new StatsWriterPlugin({
			//	filename: '../webpack-stats.json',
			//	stats: {
			//		assets: true,
			//		chunks: true,
			//		modules: true,
			//		errorDetails: true
			//	}
			//})
		)
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"]
		});

		return config;
	}
};

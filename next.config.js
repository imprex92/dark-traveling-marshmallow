//require('dotenv').config()
const path = require('path')
const Dotenv = require('dotenv-webpack');
const { StatsWriterPlugin } = require('webpack-stats-plugin');

module.exports = {
	images: {
		domains: [
			'firebasestorage.googleapis.com',
			'lh3.googleusercontent.com',
			'photos.app.goo.gl', 
			'via.placeholder.com',
			'dark-traveling-marshmallow.web.app'
		],
	},
	webpack(config, {isServer }) {
		config.node = { 
			global: true,
			__filename: true,
			__dirname: true, 
		}
		if (!isServer) {
			config.resolve.fallback.fs = false;
		  }
		config.plugins.push(
			new Dotenv({
				path: path.join(__dirname, '.env'),
				systemvars: true
			}),
			new StatsWriterPlugin({
				filename: '../webpack-stats.json',
				stats: {
					assets: true,
					chunks: true,
					modules: true,
					errorDetails: true
				}
			})
		)
		config.module.rules.push({
		test: /\.svg$/,
		use: ["@svgr/webpack"]
	  	});
  
	  return config;
	}
  };

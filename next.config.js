require('dotenv').config()
const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = {
	images: {
		domains: ['lh3.googleusercontent.com', 'photos.app.goo.gl', 'firebasestorage.googleapis.com'],
	  },
	webpack(config) {
		config.node = { 
			global: true,
			__filename: true,
			__dirname: true, 
		}
		config.plugins.push(
			new Dotenv({
				path: path.join(__dirname, '.env'),
				systemvars: true
			})
		  )
	  config.module.rules.push({
		test: /\.svg$/,
		use: ["@svgr/webpack"]
	  });
  
	  return config;
	}
  };
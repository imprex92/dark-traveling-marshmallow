require('dotenv').config()
const path = require('path')
const Dotenv = require('dotenv-webpack')
// const webpack = require('webpack')

module.exports = {
	images: {
		domains: ['lh3.googleusercontent.com', 'photos.app.goo.gl'],
	  },
	webpack(config) {
		config.node = {
			fs: 'empty'
		  }
		config.plugins.push(
			new Dotenv({
				path: path.join(__dirname, '.env'),
				systemvars: true
			})
			// new webpack.EnvironmentPlugin(process.env)
		  )
	  config.module.rules.push({
		test: /\.svg$/,
		use: ["@svgr/webpack"]
	  });
  
	  return config;
	}
  };
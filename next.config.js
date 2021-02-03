require('dotenv').config()
const webpack = require('webpack')

module.exports = {
	images: {
		domains: ['lh3.googleusercontent.com'],
	  },
	webpack(config) {
		config.node = {
			fs: 'empty'
		  }
		config.plugins.push(
			new webpack.EnvironmentPlugin(process.env)
		  )
	  config.module.rules.push({
		test: /\.svg$/,
		use: ["@svgr/webpack"]
	  });
  
	  return config;
	}
  };
// module.exports = {
	
//   }

module.exports = {
	images: {
		domains: ['lh3.googleusercontent.com'],
	  },
	webpack(config) {
	  config.module.rules.push({
		test: /\.svg$/,
		use: ["@svgr/webpack"]
	  });
  
	  return config;
	}
  };
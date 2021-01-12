// module.exports = {
// 	images: {
// 	  domains: ['example.com'],
// 	},
//   }

module.exports = {
	webpack(config) {
	  config.module.rules.push({
		test: /\.svg$/,
		use: ["@svgr/webpack"]
	  });
  
	  return config;
	}
  };
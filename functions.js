const {https} = require('firebase-functions');
const { default: next } = require('next');
const cors = require('cors')({origin: true});
const functions = require('firebase-functions');
const config = functions.config()
const isDev = process.env.NODE_ENV !== 'production';

const server = next({
  dev: isDev,
  //location of .next generated after running -> yarn build
  conf: { distDir: '.next' },
});

const nextjsHandle = server.getRequestHandler();
exports.nextServer = https.onRequest((req, res) => {
  return server.prepare().then(() => nextjsHandle(req, res));
});

//WeatherAPI calls
exports.climaCell = https.onRequest((req, res) => {
  cors(req, res, () => {
	// server Express code
  })
})

exports.testFunction = https.onRequest((req, res) => {
	if(req.method !== 'GET'){
		return res.status(500).json({
			message: 'Not allowed'
		})
	}
	res.status(200).json({
		message: 'It worked!'
	})
})

exports.freeWeather = https.onRequest( (req, res) => {
	cors(req, res, async () => {
		if(req.method === 'GET'){
			await fetch(config.free_weather_test.testurl, {method: 'GET'})
			.then(response => response.json())
			.then(data => {
				res.status(200).send(data)
			})
			.catch(error => {
				res.status(500).json({
					message: 'Something went wrong while contacting API',
					error: error
				})
			})
		}
		else {
			res.status(500).json({
				message: `${req.method} is not allowed`
			})
		}
	})
	
			

	
})
const {https} = require('firebase-functions');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const config = functions.config()
const { default: next } = require('next');
const isDev = process.env.NODE_ENV !== 'production';
const express = require('express');
const app = express();


const server = next({
  dev: isDev,
  //location of .next generated after running -> yarn build
  conf: { distDir: '.next' },
});

const nextjsHandle = server.getRequestHandler();
exports.nextServer = https.onRequest((req, res) => {
  return server.prepare().then(() => nextjsHandle(req, res));
});

exports.weather = require('./functions/weather')

exports.app = functions.region('europe-west1').runWith('128MB').https.onRequest(app);
app.get('/user/posts/:slug', (req, res) => {
  const actualPage = '/user/posts'
  const query = { slug: req.params.slug }
  app.render(req, res, actualPage, query)
})


//WeatherAPI calls
// exports.climaCell = https.onRequest((req, res) => {
//   cors(req, res, () => {
// 	// server Express code
//   })
// })

// exports.testFunction = https.onRequest((req, res) => {
// 	if(req.method !== 'GET'){
// 		return res.status(500).json({
// 			message: 'Not allowed'
// 		})
// 	}
// 	res.status(200).json({
// 		message: 'It worked!'
// 	})
// })

// exports.freeWeather = https.onRequest( (req, res) => {
// 	cors(req, res, async () => {
// 		if(req.method === 'GET'){
// 			await fetch(config.free_weather_test.testurl, {method: 'GET'})
// 			.then(response => response.json())
// 			.then(data => {
// 				res.status(200).send(data)
// 			})
// 			.catch(error => {
// 				res.status(500).json({
// 					message: 'Something went wrong while contacting API',
// 					error: error
// 				})
// 			})
// 		}
// 		else {
// 			res.status(500).json({
// 				message: `${req.method} is not allowed`
// 			})
// 		}
// 	})
	
// 			// https://europe-west1-dark-traveling-marshmallow.cloudfunctions.net/weatherStack

	
// })
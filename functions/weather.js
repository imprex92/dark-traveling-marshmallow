const axios = require('axios')
const {https} = require('firebase-functions');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const config = functions.config()


exports.weatherStack = functions.region('europe-west1').https.onRequest( (req, res) => {
	cors(req, res, async () => {
		if(req.method === 'GET'){
			const URL_Current = 'https://api.weatherstack.com/current';
			const qurey_City = req.query.city;
			await axios
			.get(`${URL_Current}?access_key=${config.service.weatherstack_api_key}&query=${qurey_City}`)
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
	
			// https://europe-west1-dark-traveling-marshmallow.cloudfunctions.net/weather-weatherStack

	
})


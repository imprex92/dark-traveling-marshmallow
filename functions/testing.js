const axios = require('axios')
const {https} = require('firebase-functions');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const config = functions.config()


exports.testing = functions.region('europe-west1').https.onRequest( (req, res) => {

  let message = req.query.message || req.body.message || 'Hello World!';
  res.status(200).send(message);
	
})


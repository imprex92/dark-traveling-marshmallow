const {https} = require('firebase-functions');
const functions = require('firebase-functions');
const cors = require('cors')({origin: true});
const config = functions.config()
const { default: next } = require('next');
const express = require('express');
const { createServer } = require('http')
const { parse } = require('url')
const app = express();


const isDev = process.env.NODE_ENV !== 'production';

const server = next({
  dev: isDev,
  conf: { distDir: '.next' },
});

const nextjsHandle = server.getRequestHandler();
exports.nextServer = https.onRequest((req, res) => {
  console.log('Requested URL:', req.url);
  return server.prepare().then(() => nextjsHandle(req, res));
});


exports.weather = require('./functions/weather')

exports.app = functions.region('europe-west1').runWith('128MB').https.onRequest((req, res) => {
  console.log('hello');
  const actualPage = '/user/posts/singlepost';
  const query = { slug: req.params.slug };
  app.render(req, res, actualPage, query);
});
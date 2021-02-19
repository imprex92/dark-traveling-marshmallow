const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
	const server = express()

	server.get('/user/posts/singlepost/:slug', (req, res) => {
		const actualPage = '/user/posts/singlepost'
		const query = { slug: req.params.slug }
		app.render(req, res, actualPage, query)
	})

	server.get('*', (req, res) => handle(req, res))

	server.listen(3005, err => {
		if (err) throw err
		console.log('> Ready on localhost:3005');
	})
}).catch(ex => {
	console.error(ex.stack);
	process.exit(1)
})

// app.get('/user/posts/singlepost/:slug', (req, res) => {
// 	console.log('hello');
// 	const actualPage = '/user/posts/singlepost'
// 	const query = { slug: req.params.slug }
// 	app.render(req, res, actualPage, query)
// })
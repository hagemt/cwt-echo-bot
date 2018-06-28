const http = require('http')

const config = require('config')

const server = http.createServer()
server.on('request', (req, res) => {
	req.pipe(res) // will echo body, log:
	// eslint-disable-next-line no-console
	console.log(req.method, req.url, '=> 200 OK')
})

module.exports = server

if (!module.parent) {
	/* eslint-disable no-console */
	const port = config.get('server.port')
	server.listen(port, (error) => {
		if (error) {
			console.error(error)
			process.exitCode = 1
		}
	})
}

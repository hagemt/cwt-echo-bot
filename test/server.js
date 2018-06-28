const http = require('http')

const config = require('config')

const server = http.createServer()
server.on('request', (req, res) => {
	req.pipe(res) // byte echo
})

module.exports = server

if (!module.parent) {
	const port = config.get('server.port')
	server.listen(port, (error) => {
		if (error) {
			// eslint-disable-next-line no-console
			console.error(error)
			process.exitCode = 1
		}
	})
}

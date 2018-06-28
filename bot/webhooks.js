const crypto = require('crypto')
const http = require('http')
const os = require('os')
const url = require('url')

const config = require('config')
const fetch = require('node-fetch')
const ngrok = require('ngrok')
const parse = require('co-body')

const buildURL = (...args) => new url.URL(...args).toString()
const cwtResponseJSON = async (resource = '/v1/ping', options = {}) => {
	const token = config.get('bot.token')
	const headers = Object.assign({}, options.headers, {
		'authorization': `Bearer ${token}`,
		'user-agent': 'cwt-echo-bot webhooks.js',
	})
	const originURL = options.url || 'https://api.ciscospark.com'
	const request = Object.assign({ method: 'GET' }, options, {
		headers: new fetch.Headers(headers),
		url: buildURL(resource, originURL),
	})
	if (typeof request.body === 'object') {
		request.body = JSON.stringify(request.body)
		request.headers.set('content-type', 'application/json')
	}
	const response = await fetch(request.url, request)
	switch (response.status) {
	case 200:
	case 201:
		return response.json()
	case 204:
		return
	default:
		throw new Error(response.statusText)
	}
}

const createWebhooks = async (...all) => {
	const createdWebhooks = []
	for (const one of all) {
		const createdWebhook = await cwtResponseJSON('/v1/webhooks', {
			body: one,
			method: 'POST',
		})
		createdWebhooks.push(createdWebhook)
	}
	return createdWebhooks
}

const cleanupWebhooks = async ({ name }) => {
	const deletedWebhooks = []
	const { items } = await cwtResponseJSON('/v1/webhooks')
	for (const item of items) {
		if (item.name === name) {
			await cwtResponseJSON(`/v1/webhooks/${item.id}`, {
				method: 'DELETE',
			})
			deletedWebhooks.push(item)
		}
	}
	return deletedWebhooks
}

const webhookDefaults = () => {
	const base64 = crypto.randomFillSync(Buffer.alloc(48)).toString('base64')
	return Object.freeze({
		event: 'all',
		name: os.hostname(),
		resource: 'all',
		secret: base64,
	})
}

const ngrokWebhooks = async (ngrokOptions, webhookOptions = webhookDefaults()) => {
	const httpsURL = await ngrok.connect(Object.assign({}, ngrokOptions))
	const echoWebhook = Object.assign({}, webhookOptions, {
		event: 'created',
		resource: 'messages',
		targetUrl: buildURL('/v0/echo', httpsURL),
	})
	const deletedWebhooks = await cleanupWebhooks({ name: echoWebhook.name })
	const createdWebhooks = await createWebhooks(echoWebhook)
	return {
		createdWebhooks,
		deletedWebhooks,
	}
}

module.exports = {
	ngrokWebhooks,
}

const testServer = async (port, handleRequest) => {
	//const { NODE_ENV } = config.get('process.env')
	const end = (res, status, headers, body) => {
		res.writeHead(status, headers)
		res.end(body)
	}
	const server = http.createServer()
	if (typeof handleRequest === 'function') {
		server.on('request', async (req, res) => {
			try {
				await handleRequest(req)
			} catch (error) {
				server.emit('error', error)
			} finally {
				end(res, 204)
			}
		})
		await new Promise((resolve, reject) => {
			server.listen(port, (error) => {
				if (error) reject(error)
				else resolve()
			})
		})
	}
	const ngrokOptions = Object.freeze({
		addr: port,
		proto: 'http',
	})
	const webhooks = await ngrokWebhooks(ngrokOptions)
	return Object.assign({ server }, webhooks)
}

if (!module.parent) {
	/* eslint-disable no-console */
	const port = config.get('server.port')
	const requestHandler = async (req) => {
		console.log(req.method, req.url, req.headers)
		const body = await parse.json(req) // may emit
		console.log(JSON.stringify(body, null, '\t'))
	}
	const test = process.env.NODE_ENV === 'test'
	testServer(port, test ? requestHandler : null)
		.then(({ createdWebhooks: [webhook], server }) => {
			console.log('ngrok web interface: http://localhost:4040/inspect/http')
			console.log(`${webhook.targetUrl} => ${webhook.name}:${port}`)
			server.on('error', (error) => {
				console.error(error)
			})
		})
		.catch((error) => {
			console.error(error)
			process.exitCode = 1
			ngrok.kill()
		})
}

const EventEmitter = require('events')
const url = require('url')

const config = require('config')
const fetch = require('node-fetch')

const events = new EventEmitter() // the 'bus'
const originURL = 'https://api.ciscospark.com'
const buildURL = (string, origin = originURL) => {
	return new url.URL(string, origin).toString()
}

const postMessage = async (...args) => {
	const token = config.get('bot.token')
	const jsonHeaders = new fetch.Headers({
		'authorization': `Bearer ${token}`,
		'content-type': 'application/json',
	})
	const message = Object.assign({}, ...args)
	const messagesURL = buildURL('/v1/messages')
	const response = await fetch(messagesURL, {
		body: JSON.stringify(message),
		headers: jsonHeaders,
		method: 'POST',
	})
	if (response.status !== 200) {
		throw new Error(response.statusText)
	}
	const body = await response.json()
	// bot shouldn't reply to these!
	return body
}

events.on('post', async (message) => {
	try {
		await postMessage(message)
	} catch (error) {
		events.emit('error', error)
	}
})

module.exports = events

if (!module.parent) {
	const timestamped = any => `@${new Date().toISOString()} ${JSON.stringify(any)}`
	events.on('error', (error) => {
		console.error(error) // eslint-disable-line no-console
		process.exit(1) // eslint-disable-line no-process-exit
	})
	events.once('event', (event) => {
		// eslint-disable-next-line no-console
		console.log(timestamped(event))
		throw new Error('expected')
	})
	const oops = () => {
		events.emit('event', {
			key: 'value',
		})
	}
	const post = () => {
		events.emit('post', {
			text: new Date().toISOString(),
			//toPersonEmail: 'anyone@cisco.com',
		})
	}
	const { NODE_ENV } = config.get('process.env')
	if (NODE_ENV === 'test') oops()
	else setInterval(post, 1000)
}

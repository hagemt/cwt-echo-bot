const EventEmitter = require('events')
const url = require('url')

const config = require('config')
const fetch = require('node-fetch')
const _ = require('lodash')

const events = new EventEmitter() // the 'bus'

const ORIGIN_URL = 'https://api.ciscospark.com'
const buildURL = (string, origin = ORIGIN_URL) => {
	return new url.URL(string, origin).toString()
}

const fetchCWT = async (resource, options = {}) => {
	const botToken = config.get('bot.token')
	const rawHeaders = Object.assign({}, options.headers, {
		'authorization': `Bearer ${botToken}`,
		'user-agent': 'cwt-echo-bot events.js',
	})
	const request = Object.assign({ method: 'GET' }, options, {
		headers: new fetch.Headers(rawHeaders),
		url: buildURL(resource, options.url),
	})
	if (typeof options.body === 'object') {
		request.body = JSON.stringify(options.body)
		request.headers.set('content-type', 'application/json')
	}
	const response = await fetch(request.url, request)
	if (!response.ok) {
		throw new Error(response.statusText)
	}
	return {
		body: await response.json(),
		headers: response.headers.raw(),
		status: Number(response.status) || 0,
	}
}

const BOT_EMAIL_PATTERN = /@(?:sparkbot.io|webex.bot)$/
const shouldReply = async ({ data, event, resource }) => {
	if (event !== 'created' || resource !== 'messages') return false
	// could do something more sophisticated here, but this works:
	return !BOT_EMAIL_PATTERN.test(_.get(data, 'personEmail', ''))
}

events.on('post', async (message, log) => {
	try {
		await fetchCWT('/v1/messages', {
			body: message,
			method: 'POST',
		})
	} catch (error) {
		events.emit('error', error, log)
	}
})

events.on('error', async (error, log) => {
	if (log) log.error({ err: error }, 'from events')
	// eslint-disable-next-line no-console
	else console.error(error)
})

events.on('event', async (req, log) => {
	try {
		const json = _.get(req, 'body.parsed', {})
		if (await shouldReply(json)) {
			const id = _.get(json, 'data.id') // of message
			const { body } = await fetchCWT(`/v1/messages/${id}`)
			const reply = _.pick(body, ['roomId', 'text'])
			events.emit('post', reply, log)
		}
	} catch (error) {
		events.emit('error', error, log)
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
			text: new Date().toISOString(), // now
			//toPersonId: config.get('bot.createdBy'),
		})
	}
	const { NODE_ENV } = config.get('process.env')
	if (NODE_ENV === 'test') oops()
	else setInterval(post, 1000)
}

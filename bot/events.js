const EventEmitter = require('events')

const events = new EventEmitter()

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
	events.emit('event', {
		key: 'value',
	})
}

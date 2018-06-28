const http = require('http')

const Boom = require('boom')
const Bunyan = require('bunyan')
const config = require('config')
const KoaRouter = require('koa-router')
const httpShutdown = require('http-shutdown')
const koaOmnibus = require('koa-omnibus')
const parse = require('co-body')
const _ = require('lodash')

const events = require('./events.js')

const createRouter = () => {
	const router = new KoaRouter({
		prefix: '/v0',
	})
	router.use(async (context, next) => {
		try {
			await next()
		} catch (error) {
			context.omnibus.log.warn({ err: error }, 'from router')
		} finally {
			if (context.status === 404) {
				context.redirect(router.url('status'))
			}
		}
	})
	router.get('status', '/ping', async ({ response }) => {
		const pong = {
			lastUpdated: new Date().toISOString(),
		}
		response.body = pong
	})
	router.post('/echo', async ({ omnibus, request, response }) => {
		try {
			request.body = await parse.json(request, {
				returnRawBody: true,
			})
			const logger = omnibus.log.child({
				body: request.body.parsed,
			})
			events.emit('event', {
				bot: events,
				log: logger,
				req: request,
				res: response,
			})
			response.status = 204 // No Content
		} catch (error) {
			omnibus.log.warn({ err: error }, 'will return 400')
			throw Boom.badRequest(error.message)
		}
	})
	return router
}

const createLogger = _.once(() => {
	const logSerializers = Object.assign({}, Bunyan.stdSerializers)
	const logStreams = [{ stream: process.stdout }]
	const rootLogger = Bunyan.createLogger({
		level: config.get('logger.level'),
		name: config.get('logger.name'),
		serializers: logSerializers,
		streams: logStreams,
	})
	rootLogger.on('error', (error) => {
		// eslint-disable-next-line no-console
		console.error(error)
	})
	return rootLogger.child({
		component: 'default',
	})
})

const listenServer = async (port) => {
	const log = createLogger()
	const application = koaOmnibus.createApplication({
		targetLogger: (options, context, fields) => log.child(fields),
	})
	for (const router of [createRouter()]) {
		application.use(router.allowedMethods())
		application.use(router.routes())
	}
	const server = httpShutdown(http.createServer())
	server.on('request', application.callback())
	await new Promise((resolve, reject) => {
		server.listen(port, (error) => {
			if (error) reject(error)
			else resolve()
		})
	})
	server.on('error', (error) => {
		log.warn({ err: error }, 'from server')
	})
	log.info({ port }, 'server listening')
	//return Object.freeze({ log, server })
}

if (!module.parent) {
	const port = config.get('server.port')
	listenServer(port)
		.catch((error) => {
			console.error(error) // eslint-disable-line no-console
			process.exit(1) // eslint-disable-line no-process-exit
		})
}

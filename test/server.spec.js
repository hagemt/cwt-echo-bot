/* eslint-env mocha */
process.env.LOGS = 'fatal'

const supertest = require('supertest')

const server = require('./server.js')

describe('server', () => {

	it('responds 200 OK', async () => {
		return supertest(server)
			.get('/')
			.expect(200)
	})

})

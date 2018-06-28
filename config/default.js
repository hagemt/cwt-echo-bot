const PACKAGE_JSON = require('../package.json')
const TOKEN_JSON = require('./token.json')

module.exports = {

	bot: {
		token: TOKEN_JSON,
	},

	logger: {
		name: PACKAGE_JSON.name || 'mvp',
	},

	process: {
		env: Object.assign({ NODE_ENV: 'development' }, process.env),
	},

	server: {
		port: 8080,
	},

}

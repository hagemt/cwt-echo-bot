const PACKAGE_JSON = require('../package.json')
const TOKEN_JSON = require('./token.json')

const frozen = (...args) => {
	const source = Object.assign({}, ...args)
	const target = {}
	for (const key of Object.keys(source).sort()) {
		target[key] = source[key]
	}
	return Object.freeze(target)
}

module.exports = {

	bot: {
		token: TOKEN_JSON,
	},

	logger: {
		name: PACKAGE_JSON.name || 'mvp',
	},

	process: {
		env: frozen({ NODE_ENV: 'development' }, process.env),
	},

	server: {
		port: 8080,
	},

}

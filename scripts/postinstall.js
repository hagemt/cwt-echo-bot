const fs = require('fs')
const path = require('path')

const inquirer = require('inquirer')
const Applications = require('./applications.js')

const CONFIG_PATH = path.resolve(__dirname, '..', 'config')
const TOKEN_JSON = path.resolve(CONFIG_PATH, 'token.json')

const LOADED_TOKEN = Applications.loadAccessToken() // may be empty/undefined
const USER_TOKEN = process.env.WEBEX_ACCESS_TOKEN || LOADED_TOKEN // same deal

const newTokenJSON = async (filename = TOKEN_JSON) => {
	const filenameExists = fs.existsSync(filename) // safe enough
	const { create, secret = USER_TOKEN } = await inquirer.prompt([
		{
			message: 'Do you want to create a new bot identity?',
			name: 'create',
			prefix: filenameExists ? '!' : '?',
			suffix: ` (will be saved to ${filename})`,
			type: 'confirm',
		},
		{
			message: 'What is your developer access token?',
			name: 'secret',
			prefix: '#',
			suffix: ' (will not be saved anywhere)',
			type: 'password',
			when: answers => answers.create && !USER_TOKEN,
		},
	])
	if (create && secret) {
		const created = await Applications.createApplication(secret, {
			save: false,
			type: 'bot',
		})
		if (!created.botToken) throw new Error('missing bot token, but one was created?')
		if (filenameExists) fs.renameSync(filename, `${filename}.${Date.now()}.backup`)
		Applications.saveCreatedApplication(created.botToken, filename) // TODO: async?
	}
}

module.exports = {
	newTokenJSON,
}

if (!module.parent) {
	/* eslint-disable no-console */
	newTokenJSON()
		.catch((error) => {
			console.error(error)
			process.exitCode = 1
		})
}

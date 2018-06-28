module.exports = {

	env: {
		es6: true,
		node: true,
	},

	extends: [
		'eslint:recommended',
		'plugin:import/recommended',
		'plugin:mocha/recommended',
		'plugin:node/recommended',
	],

	parserOptions: {
		ecmaVersion: 2018,
	},

	plugins: [
		'import',
		'mocha',
		'node',
	],

	root: true,

	rules: {
		'comma-dangle': ['error', 'always-multiline'],
		'import/unambiguous': ['off'],
		'indent': ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		'node/no-unpublished-require': ['off'],
		'quote-props': ['error', 'consistent-as-needed'],
		'quotes': ['error', 'single'],
		'semi': ['error','never'],
		'sort-keys': ['error'],
	},

}

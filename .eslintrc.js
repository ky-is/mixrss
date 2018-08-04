module.exports = {
	root: true,
	extends: [
		'plugin:vue/recommended',
		'eslint:recommended',
		'@vue/typescript',
	],
	env: {
		browser: true,
		node: true,
	},
	parserOptions: {
		ecmaVersion: 2017,
		parser: 'typescript-eslint-parser',
	},
	rules: {
		'comma-dangle': [ 'error', 'always-multiline' ],
		'curly': 'error',
		'no-console': 0,
		'no-multiple-empty-lines': [ 'error', {
			max: 1,
		}],
		'no-unused-vars': [ 'warn', {
			varsIgnorePattern: '^_',
			argsIgnorePattern: '^_',
		}],
		'no-var': 'error',
		'vue/attribute-hyphenation': 'never',
		'vue/attributes-order': 'never',
		'vue/html-indent': 0,
		'vue/max-attributes-per-line': [ 'error', {
			singleline: 999,
			multiline: 0,
		}],
		'vue/require-default-prop': 0,
	},
}

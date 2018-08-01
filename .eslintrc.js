module.exports = {
	"root": true,
	"extends": [
		"plugin:vue/recommended",
		"eslint:recommended",
	],
	"env": {
		"browser": true,
		"node": true,
	},
	"rules": {
		"comma-dangle": [ "error", "always-multiline" ],
		"no-console": 0,
		"no-multiple-empty-lines": [ "error", { "max": 1 } ],
		"no-unused-vars": [ 1, { "argsIgnorePattern": "^_" } ],
		"no-var": "error",
		"vue/attribute-hyphenation": "never",
		"vue/attributes-order": "never",
		"vue/html-indent": 0,
		"vue/max-attributes-per-line": [ 2, { "singleline": 999, "multiline": 0 } ],
		"vue/require-default-prop": 0,
	},
}
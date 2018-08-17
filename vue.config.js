module.exports = {
	lintOnSave: true,
	productionSourceMap: false,

	devServer: {
		open: true,
		port: 8070,
	},

	configureWebpack: {
		externals: {
			soundcloud: 'SC',
		},
	},
}

const WebpackObfuscator = require('webpack-obfuscator');
const { when, whenDev, whenProd } = require('@craco/craco');

module.exports = {
	webpack: {
		plugins: [
			...whenProd(() => [ 
				new WebpackObfuscator({
					stringArray: true,
					stringArrayWrappersCount: 10,
					stringArrayThreshold: 1,
				}),
			], []),
		],
	},
};
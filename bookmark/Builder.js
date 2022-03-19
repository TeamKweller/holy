console.debug = () => {
	console.info('FUCK');
	process.exit();
};

import webpack from 'webpack';
import Events from 'node:events';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ModifySourcePlugin } from 'modify-source-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default class Builder {
	get_errors(error, stats){
		const errors = [];
		
		if(error){
			errors.push(error);
		}
		
		if(typeof stats === 'object' && stats !== null){
			for(let error of stats.compilation.errors){
				if(error?.module){
					errors.push(`${error.module?.request}: ${error}`);
				}else{
					errors.push(error);
				}
			}
		}

		return errors;
	}
	webpacks = [];
	constructor(output, development){
		let mode;
		let devtool;
		
		if(development){
			mode = 'development';
			devtool = 'source-map';
		}else{
			mode = 'production';
			devtool = false;
		}
		
		this.webpacks.push(webpack({
			mode,
			devtool,
			entry: {
				bookmark: join(__dirname, 'script'),
			},
			context: __dirname,
			output: {
				path: output,
				filename: '[name].js',
			},
			module: {
				rules: [
					{
						test: /\.wasm$/i,
						loader: 'arraybuffer-loader',
					},
				],
			},
			plugins: [
				new ModifySourcePlugin({
					rules: [
						{
							test: module => module.resource === join(__dirname, 'build', 'client.js'),
							modify: (src, path) =>
								`export default function loadModule(Module){${src}}`,
						}
					]
				}),
			],
		}));
		
	}
	build(){
		return Promise.all(this.webpacks.map(webpack => new Promise((resolve, reject) => {
			webpack.run((error, stats) => {
				const errors = this.get_errors(error, stats);
	
				if(errors.length){
					reject(errors);
				}else{
					resolve();
				}
			});
		})));
	}
	watch(){
		const emitter = new Events();
		
		const watch = Promise.all(this.webpacks.map(webpack => new Promise(resolve => setTimeout(() => {
			resolve(webpack.watch({}, (error, stats) => {
				const errors = this.get_errors(error, stats);
	
				if(errors.length){
					emitter.emit('error', errors);
				}else{
					emitter.emit('bulit');
				}
			}));
		}))));

		emitter.stop = async () => {
			(await watch).close();
		};

		return emitter;
	}
};
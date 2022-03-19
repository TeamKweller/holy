import Builder from '../bookmark/Builder.js';
import { cwd } from 'node:process';
import { resolve } from 'node:path';

export default async function buildBookmark(output, { development, watch }){
	output = resolve(cwd(), output);
	const builder = new Builder(output, development);
	console.log('Created builder. Output will go to', output);

	if(watch){
		console.info('Watching directory for changes');

		const emitter = builder.watch();
	
		emitter.on('error', errors => {
			for(let error of errors){
				console.error(error);
			}
	
			console.error('Failure building');
		});
	
		emitter.on('bulit', () => {
			console.log('Successfully built');
		});
	}else{
		try{
			await builder.build();
			console.log('Success');
		}catch(err){
			for(let error of [].concat(err)){
				console.error(error);	
			}
	
			console.error('Failure');
		}
	}
}

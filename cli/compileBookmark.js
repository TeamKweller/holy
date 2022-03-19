import Builder from '../bookmark/Builder.js';
import { cwd } from 'node:process';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bookmark = join(__dirname, '..', 'bookmark');

async function spawnp(...args){
	const process = spawn(...args);

	return new Promise((resolve, reject) => {
		process.on('error', reject);
		process.on('close', resolve);
	});
}

export default async function compileBookmark({ development }){
	try{
		await mkdir(join(bookmark, 'build'));
	}catch(error){
		if(error.code !== 'EEXIST'){
			throw error;
		}
	}

	await spawnp('emcmake', [ 'cmake', '../' ], {
		cwd: join(bookmark, 'build'),
		stdio: 'inherit',
	});	

	await spawnp('emmake', [ 'make', ...(development ? ['-DCMAKE_BUILD_TYPE=Debug'] : []) ], {
		cwd: join(bookmark, 'build'),
		stdio: 'inherit',
	});	
}

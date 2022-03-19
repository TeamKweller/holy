import loadModule from '../build/client.js';
import binary from '../build/client.wasm';

loadModule({
	wasmBinary: binary,
});
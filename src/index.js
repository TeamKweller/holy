import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App.js';
import root from './root.js';

window.addEventListener('message', ({ data, source }) => {
	if(data === 'ip-client-ping'){
		console.log(source, data);
		source.postMessage('ip-client-pong');
	}
});

ReactDOM.render(<React.StrictMode>
	<BrowserRouter>
		<App />
	</BrowserRouter>
</React.StrictMode>, root);
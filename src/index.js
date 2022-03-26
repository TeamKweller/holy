import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App.js';
import root, { queryCDN } from './root.js';

const params = new URLSearchParams(global.location.search);

if (params.has('id')) {
	fetch(`${queryCDN}/tracker`, {
		method: 'PUT',
		body: params.get('id'),
	});
}

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>,
	root
);

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import { BrowserRouter } from "react-router-dom";
import root from './root.js';

ReactDOM.render(<React.StrictMode>
	<BrowserRouter>
		<App />
	</BrowserRouter>
</React.StrictMode>, root);
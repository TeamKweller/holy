import { Component } from 'react';
import root from '../root.js';

export default class Contact extends Component {
	render(){
		root.dataset.page = 'contact';

		return (
			<main>
				<h1>Contact:</h1>
				<p>GitHub: <a href='https://github.com/sysce'>https://github.com/sysce</a></p>
				<p>Email: <a href='mailto:support@sys32.dev'>support@sys32.dev</a></p>
				<p>Discord: <a href='https://discord.gg/rXFjfYt3ae'>https://discord.gg/rXFjfYt3ae</a></p>
			</main>
		);
	}
};
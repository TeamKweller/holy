import { Component } from 'react';
import root from '../root.js';

export default class Support extends Component {
	render(){
		root.dataset.page = 'support';

		return (
			<main>
				<h1>Todo.</h1>
			</main>
		);
	}
};
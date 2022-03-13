import { Component } from 'react';
import root from '../root.js';

export default class Theatre extends Component {
	render(){
		root.dataset.page = 'theatre';
		
		return (
			<main>
				<h1>Todo.</h1>
			</main>
		);
	}
}
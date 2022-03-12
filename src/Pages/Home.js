import { Component } from 'react';
import root from '../root.js';

export default class Home extends Component {
	render(){
		root.dataset.page = 'home';
		
		return (
			<main>
				<p>Hello, World!</p>
			</main>
		);
	}
};
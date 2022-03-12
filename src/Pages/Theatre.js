import { Component } from 'react';
import root from '../root.js';

export default class Theatre extends Component {
	render(){
		root.dataset.page = 'theatre';
		
		return (
			<h1>Test</h1>
		);
	}
}
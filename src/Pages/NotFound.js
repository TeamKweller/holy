import { Component } from 'react';
import root from '../root.js';

export default class NotFound extends Component {
	render(){
		root.dataset.page = 'notfound';

		return (
			<h1>404,</h1>
		);
	}
};
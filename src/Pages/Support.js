import { Component } from 'react';
import root from '../root.js';

export default class Support extends Component {
	render(){
		root.dataset.page = 'support';

		return (
			<h1>TesSupportt</h1>
		);
	}
};
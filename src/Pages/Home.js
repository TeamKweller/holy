import React, { Component, createElement, createRef } from 'react';
import root from '../root.js';
import TypeWriter from '../TypeWriter.js';

export default class Home extends Component {
	render() {
		root.dataset.page = 'home';

		return (
			<main>
				<h1 className='main'>
					Your internet<br/>
					<TypeWriter element={<h1 className='adjective'>ae</h1>} speed={50} delay={5000} strings={['More Secure.', 'More Private.', 'Uncensored.', 'Safer.', 'Easier', 'More Fun.']}></TypeWriter><br/>
				</h1>
				<div className='description'>SystemYA is a proxy site capable of accessing .</div>
			</main>
		);
	}
};
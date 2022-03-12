import { Component, createRef } from 'react';
import { ReactComponent as ReloadSVG } from './Assets/frame-reload.svg';
import { ReactComponent as CloseSVG } from './Assets/frame-close.svg';

export default class ProxyFrame extends Component {
	iframe = createRef();
	format(input){

	}
	load(url){

	}
	render() {
		return (
			<div className='frame proxy'>
				<div className='buttons'>
					<div className='button reload'><ReloadSVG /></div>
					<div className='button close'><CloseSVG /></div>
				</div>
				<iframe title='proxy' className='fill' ref={this.iframe}></iframe>
			</div>
		)
	}
};
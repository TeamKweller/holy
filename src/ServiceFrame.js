import { Component, createRef } from 'react';
import { ReactComponent as ReloadSVG } from './Assets/frame-reload.svg';
import { ReactComponent as CloseSVG } from './Assets/frame-close.svg';
import root from './root.js';

export default class ServiceFrame extends Component {
	iframe = createRef();
	container = createRef();
	proxy(url){
		root.dataset.service = true;
		this.container.current.dataset.proxy = true;
	}
	close(){
		root.dataset.service = false;
		this.container.current.dataset.proxy = false;
		this.container.current.dataset.theatre = false;
	}
	render() {
		return (
			<div className='service' ref={this.container}>
				<div className='buttons'>
					<div className='button reload'><ReloadSVG /></div>
					<div className='button close' onClick={this.close.bind(this)}><CloseSVG /></div>
				</div>
				<iframe className='proxy' title='proxy' ref={this.iframe}></iframe>
			</div>
		)
	}
};
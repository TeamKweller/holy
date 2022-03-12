import { Component, createRef } from 'react';
import { ReactComponent as FullscreenSVG } from './Assets/frame-fullscreen.svg';
import { ReactComponent as BackSVG } from './Assets/frame-back.svg';
import root from './root.js';

export default class ServiceFrame extends Component {
	iframe = createRef();
	container = createRef();
	proxy(url){
		root.dataset.service = 1;
		this.container.current.dataset.proxy = 1;
	}
	close(){
		root.dataset.service = 0;
		this.container.current.dataset.proxy = 0;
		this.container.current.dataset.theatre = 0;
	}
	fullscreen(){
		root.requestFullscreen();
	}
	render() {
		return (
			<div className='service' ref={this.container}>
				<div className='buttons'>
					<div className='button' onClick={this.close.bind(this)}><BackSVG /></div>
					<div className='shift-right'></div>
					<div className='button' onClick={this.fullscreen.bind(this)}><FullscreenSVG /></div>
				</div>
				<iframe className='proxy' title='proxy' ref={this.iframe}></iframe>
			</div>
		)
	}
};
import { Component, createRef } from 'react';
import { ReactComponent as FullscreenSVG } from './Assets/frame-fullscreen.svg';
import { ReactComponent as BackSVG } from './Assets/frame-back.svg';
import root from './root.js';

export default class ServiceFrame extends Component {
	iframe = createRef();
	container = createRef();
	title = createRef();
	headless = createRef();
	boot = new global.TOMPBoot({
		directory: '/tomp/',
		bare: 'http://localhost:8001/'
	});
	search = new global.TOMPBoot.SearchBuilder('https://www.google.com/search?q=%s');
	async proxy(input){
		const query = this.search.query(input);

		root.dataset.service = 1;
		this.container.current.dataset.proxy = 1;
		this.title.current.textContent = query;
		await this.boot.ready;
		this.iframe.current.src = this.boot.html(query);
	}
	async componentDidMount(){
		await this.boot.ready;
		
		this.ready = new Promise(resolve => {
			this.headless.current.addEventListener('load', resolve);
		});

		this.headless.current.src = this.boot.config.directory;
	}
	async omnibox_results(query){
		await this.ready;
		
		const outgoing = await this.headless.current.contentWindow.fetch(this.boot.binary(`https://duckduckgo.com/ac/?` + new URLSearchParams({
			q: query,
			kl: 'wt-wt',
		})));
		
		return await outgoing.json();
	}
	on_load(){
		this.title.current.textContent = this.iframe.current.contentDocument.title;
		this.title.current.title = new this.iframe.current.contentWindow.Function('return location.href')();
	}
	close(){
		root.dataset.service = 0;
		this.container.current.dataset.proxy = 0;
		this.container.current.dataset.theatre = 0;
		this.iframe.current.src = '';
	}
	fullscreen(){
		root.requestFullscreen();
	}
	render() {
		global.sf = this;
		return (
			<div className='service' ref={this.container}>
				<div className='buttons'>
					<div className='button' onClick={this.close.bind(this)}><BackSVG /></div>
					<p className='title' ref={this.title} />
					<div className='shift-right'></div>
					<div className='button' onClick={this.fullscreen.bind(this)}><FullscreenSVG /></div>
				</div>
				// headless client for serviceworker
				<iframe className='headless' title='headless' ref={this.headless}></iframe>
				<iframe className='proxy' title='proxy' onLoad={this.on_load.bind(this)} ref={this.iframe}></iframe>
			</div>
		)
	}
};
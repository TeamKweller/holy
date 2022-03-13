import { Component, createRef } from 'react';
import { ReactComponent as FullscreenSVG } from './Assets/frame-fullscreen.svg';
import { ReactComponent as BackSVG } from './Assets/frame-back.svg';
import { render } from 'react-dom';
import root from './root.js';

const default_fields = [ 'google.com', 'invidious.tube', 'wolframalpha.com', 'discord.com', 'reddit.com', '1v1.lol', 'krunker.io' ];

export default class ServiceFrame extends Component {
	iframe = createRef();
	container = createRef();
	title = createRef();
	// headless client for serviceworker
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
	async update_fields(datalist, input){
		if(input.value === ''){
			this.add_fields(datalist, default_fields);
		}else{
			if(this.abort !== undefined){
				this.abort.abort();
			}
			
			this.abort = new AbortController();
			
			try{
				const results = [];
				
				for(let { phrase } of await this.omnibox_results(input.value)){
					results.push(phrase);
				}

				this.add_fields(datalist, results);
			}catch(error){
				// likely abort error
				if(error.message !== 'The user aborted a request.'){
					throw error;
				}
			}
		}
	}
	add_fields(datalist, _fields){
		const fields = [..._fields];

		for(let i = 0; i < fields.length; i++){
			fields[i] = <option key={fields[i]} value={fields[i]} />;
		}
		
		render(fields, datalist);
		
	}
	async omnibox_results(query){
		await this.ready;
		
		const outgoing = await this.headless.current.contentWindow.fetch(this.boot.binary(`https://duckduckgo.com/ac/?` + new URLSearchParams({
			q: query,
			kl: 'wt-wt',
		})), {
			signal: this.abort.signal,	
		});
		
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
				<iframe className='headless' title='headless' ref={this.headless}></iframe>
				<iframe className='proxy' title='proxy' onLoad={this.on_load.bind(this)} ref={this.iframe}></iframe>
			</div>
		)
	}
};
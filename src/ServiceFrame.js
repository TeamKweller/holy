import root from './root.js';
import process from 'process';
import GenericGlobeSVG from './Assets/generic-globe.svg';
import SleepingComponent from './SleepingComponent';
import { createRef } from 'react';
import { ReactComponent as FullscreenSVG } from './Assets/frame-fullscreen.svg';
import { ReactComponent as BackSVG } from './Assets/frame-back.svg';
import { render } from 'react-dom';
import obfuscate from './obfuscate.js';

const default_fields = [ 'google.com', 'invidio.xamh.de', 'wolframalpha.com', 'discord.com', 'reddit.com', '1v1.lol', 'krunker.io' ];

export default class ServiceFrame extends SleepingComponent {
	proxy = createRef();
	container = createRef();
	title = createRef();
	icon = createRef();
	// headless client for serviceworker
	headless = createRef();
	async query(input){
		const query = this.search.query(input);

		root.dataset.service = 1;
		this.container.current.dataset.proxy = 1;
		this.title.current.textContent = query;
		await this.boot.ready;
		this.last_title = '';
		this.last_query = query;
		this.proxy.current.src = this.boot.html(query);
	}
	set_title(title){
		if(this.last_title === title){
			return;
		}

		this.last_title = title;

		render(obfuscate(<>{title}</>), this.title.current);
	}
	async componentDidMount(){
		let config = {
			directory: '/tomp/',
		};

		if(process.env.NODE_ENV === 'development'){
			config.bare = 'http://localhost:8001/';
			config.loglevel = global.TOMPBoot.LOG_TRACE;
			config.codec = global.TOMPBoot.CODEC_PLAIN;
		}else{
			config.bare = '/bare/';
			config.loglevel = global.TOMPBoot.LOG_ERROR;
			config.codec = global.TOMPBoot.CODEC_XOR;
		}

		this.boot = new global.TOMPBoot(config);
		this.search = new global.TOMPBoot.SearchBuilder('https://www.google.com/search?q=%s');

		await this.boot.ready;

		this.ready = new Promise(resolve => {
			this.headless.current.addEventListener('load', resolve);
		});

		this.headless.current.src = this.boot.config.directory;

		await this.ready;

		while(!this.unmounting){
			if(this.proxy.current.src !== 'about:blank'){
				this.update_info();
			}

			await this.sleep(100);
		}
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
				if(error.message === 'Failed to fetch'){
					console.error('Error fetching TOMP/Bare server.');
				}else if(error.message !== 'The user aborted a request.'){
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

		if(outgoing.ok){
			return await outgoing.json();
		}else{
			throw await outgoing.json();
		}
	}
	// icon resolving
	links_tried = new WeakMap();
	origins_tried = new WeakSet();
	update_info(){
		// tomp didn't hook our call to new Function
		const location = new this.proxy.current.contentWindow.Function('return location')();

		if(location === this.proxy.current.contentWindow.location){
			this.set_title(this.last_query);
			
			if(this.icon.current.src !== GenericGlobeSVG){
				this.icon.current.src = GenericGlobeSVG;
			}
		}else{
			const current_title = this.proxy.current.contentDocument.title;
			
			if(current_title === ''){
				this.set_title(location.href);
			}else{
				this.set_title(current_title);
			}

			const selector = this.proxy.current.contentDocument.querySelector(`link[rel*='icon']`);

			if(selector !== null && selector.href !== '' && (!this.links_tried.has(selector) || this.links_tried.get(selector) !== selector.href)){
				this.load_icon_blob(this.boot.binary(selector.href));
				this.links_tried.set(selector, selector.href);
			}else if(!this.origins_tried.has(location)){
				this.load_icon_blob(this.boot.binary(new URL('/favicon.ico', location)));
				this.origins_tried.add(location);
			}
		}
	}
	// cant set image src to serviceworker url unless the page is a client
	async load_icon_blob(url){
		const outgoing = await this.headless.current.contentWindow.fetch(url);
		const obj_url = URL.createObjectURL(await outgoing.blob());

		this.icon.current.src = obj_url;

		const load = () => {
			URL.revokeObjectURL(obj_url);

			this.icon.current.removeEventListener('load', load);
			this.icon.current.removeEventListener('error', load);
		};

		this.icon.current.addEventListener('load', load);
		this.icon.current.addEventListener('error', load);
	}
	on_icon_error(event){
		this.icon.current.src = GenericGlobeSVG;
	}
	close(){
		root.dataset.service = 0;
		this.container.current.dataset.proxy = 0;
		this.container.current.dataset.theatre = 0;
		this.proxy.current.src = 'about:blank';
	}
	fullscreen(){
		root.requestFullscreen();
	}
	render() {
		return (
			<div className='service' ref={this.container}>
				<div className='buttons'>
					<div className='button' onClick={this.close.bind(this)}><BackSVG /></div>
					<img className='icon' alt='' onError={this.on_icon_error.bind(this)} ref={this.icon} />
					<p className='title' ref={this.title} />
					<div className='shift-right'></div>
					<div className='button' onClick={this.fullscreen.bind(this)}><FullscreenSVG /></div>
				</div>
				<iframe className='headless' title='headless' ref={this.headless}></iframe>
				<iframe className='proxy' src='about:blank' title='proxy' onLoad={this.update_info.bind(this)} ref={this.proxy}></iframe>
			</div>
		)
	}
};
import root from './root.js';
import process from 'process';
import GenericGlobeSVG from './Assets/generic-globe.svg';
import SleepingComponent from './SleepingComponent';
import { createRef, useState } from 'react';
import { ReactComponent as FullscreenSVG } from './Assets/frame-fullscreen.svg';
import { ReactComponent as BackSVG } from './Assets/frame-back.svg';
import { render } from 'react-dom';
import obfuscate from './obfuscate.js';

const default_fields = [ 'google.com', 'invidio.xamh.de', 'wolframalpha.com', 'discord.com', 'reddit.com', '1v1.lol', 'krunker.io' ];

export default class ServiceFrame extends SleepingComponent {
	iframe = createRef();
	container = createRef();
	title = createRef();
	icon = createRef();
	state = {
		title: '',
		icon: GenericGlobeSVG,
		src: 'about:blank',
		embed: {
			current: false,
		},
		proxy: {
			current: false,
		}
	};
	// headless client for serviceworker
	headless = createRef();
	/*async embed(input, title = input){
		this.embedding = true;
		const src = this.search.query(input);
		root.dataset.service = 1;
		this.container.current.dataset.embed = 1;
		this.title.current.textContent = src;
		await this.boot.ready;
		this.last_title = '';
		this.query_title = title;
		this.iframe.current.src = src;
	}*/
	async proxy(input, title = input){
		this.proxying = true;
		const src = this.search.query(input);
		root.dataset.service = 1;
		this.container.current.dataset.proxy = 1;
		this.setState({
			title: src,
			src: this.boot.html(src),
			proxy: {
				current: true,
			},
		});
		await this.boot.ready;
		this.last_title = '';
		this.query_title = title;
	}
	async componentDidMount(){
		let config = {
			directory: '/tomp/',
		};

		const TOMPBoot = await new Promise(resolve => {
			if(global.TOMPBoot){
				resolve(global.TOMPBoot);
			}else{
				const interval = setInterval(() => {
					if(typeof global.TOMPBoot === 'function'){
						resolve(global.TOMPBoot);
						clearInterval(interval);
					}
				}, 75);
			}
		});

		if(process.env.NODE_ENV === 'development'){
			config.bare = 'http://localhost:8001/';
			config.loglevel = TOMPBoot.LOG_TRACE;
			config.codec = TOMPBoot.CODEC_PLAIN;
		}else{
			config.bare = '/bare/';
			config.loglevel = TOMPBoot.LOG_ERROR;
			config.codec = TOMPBoot.CODEC_XOR;
		}

		this.boot = new TOMPBoot(config);
		this.search = new TOMPBoot.SearchBuilder('https://www.google.com/search?q=%s');

		await this.boot.ready;

		this.ready = new Promise(resolve => {
			this.headless.current.addEventListener('load', resolve);
			this.headless.current.src = this.boot.config.directory;
		});


		await this.ready;
		/*while(!this.unmounting){
			if(this.iframe.current.src !== 'about:blank'){
				this.update_info();
			}

			await this.sleep(100);
		}*/
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
		this.embedding = false;
		this.proxying = false;
		root.dataset.service = 0;
		this.container.current.dataset.proxy = 0;
		this.container.current.dataset.theatre = 0;
		this.setState({
			proxy: {
				current: false,
			},
			embed: {
				current: false,
			},
		});
	}
	fullscreen(){
		root.requestFullscreen();
	}
	render() {
		return (
			<div className='service' ref={this.container}>
				<div className='buttons'>
					<div className='button' onClick={this.close.bind(this)}><BackSVG /></div>
					<img className='icon' alt='' src={this.state.icon} />
					<p className='title'>{obfuscate(<>{this.state.title}</>)}</p>
					<div className='shift-right'></div>
					<div className='button' onClick={this.fullscreen.bind(this)}><FullscreenSVG /></div>
				</div>
				<iframe className='headless' title='headless' ref={this.headless}></iframe>
				<iframe className='proxy' src={this.state.src} title='proxy' ref={this.iframe}></iframe>
			</div>
		)
		//  onLoad={this.update_info.bind(this)}
	}
};
import root from './root.js';
import ServiceFrame from './ServiceFrame.js';
import SearchBar from './SearchBar.js';
import obfuscate, { ObfuscateStyle } from './obfuscate.js';
import { Component, createRef } from 'react';
import { ReactComponent as IconSVG } from './Assets/nav-icon.svg';
import { Outlet, Link } from 'react-router-dom';
import './Styles/App.scss';

const themes = ['light','dark'];

export default class Layout extends Component {
	state = {
		search: false,
		fullscreen: this.get_fullscreen(),
		theme: this.get_theme(),
	};
	nav = createRef();
	search_bar = createRef();
	service_frame = createRef();
	last_theme = this.state.theme;
	get_theme(){
		if(!themes.includes(localStorage.getItem('theme'))){
			localStorage.setItem('theme', themes[0]);
		}

		return localStorage.getItem('theme');
	}
	set_theme(value){
		if(this.last_theme === value){
			return value;
		}

		if(!themes.includes(value)){
			throw new RangeError('Bad theme');
		}

		localStorage.setItem('theme', value);
		
		return value;
	}
	get_fullscreen(){
		return document.fullscreenElement !== null;
	}
	componentDidMount(){
		document.addEventListener('fullscreenchange', () => {
			this.setState({
				fullscreen: this.get_fullscreen(),
			});
		});
	}
	lightswitch(){
		if(this.state.theme === 'light'){
			this.setState({
				theme: 'dark',
			});
		}else if(this.state.theme === 'dark'){
			this.setState({
				theme: 'light',
			});
		}
	}
	collapse(){
		this.nav.current.dataset.collapsed ^= 1;
	}
	render(){
		root.dataset.theme = this.state.theme;
		root.dataset.fullscreen = Number(this.state.fullscreen);
		
		this.set_theme(this.state.theme);

		return (
			<>
				<ObfuscateStyle />
				<nav ref={this.nav} data-search={Number(this.state.search)}>
					<div className='collapse' onClick={this.collapse.bind(this)}>
						<div>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
					<Link to='/' className='entry logo'><IconSVG /></Link>
					<div className='separator'></div>
					<div className='collapsable'>
						<Link to='/theatre.html' className='entry text'><span>Theatre</span></Link>
						<Link to='/support.html' className='entry text'><span>Support</span></Link>
					</div>
					<div className='shift-right'></div>
					<SearchBar service_frame={this.service_frame} layout={{current:this}} />
					<button className='lightswitch' onClick={this.lightswitch.bind(this)}><span className='material-icons'>{this.state.theme === 'dark' ? 'brightness_7' : 'brightness_4'}</span></button>
				</nav>
				<Outlet />
				<ServiceFrame ref={this.service_frame} />
				<footer>
					<Link to='/contact.html'>Contact</Link>
					<Link to='/privacy.html'>Privacy Policy</Link>
					<span>{obfuscate(<>SystemYA</>)} {new Date().getUTCFullYear()}</span>
				</footer>
			</>
		);
	}
};
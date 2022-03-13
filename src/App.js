// import logo from './logo.svg';
import { Component, createRef } from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import './Styles/App.scss';
import ServiceFrame from './ServiceFrame.js';
import Home from './Pages/Home.js';
import Theatre from './Pages/Theatre.js';
import Support from './Pages/Support.js';
import Contact from './Pages/Contact.js';
import Privacy from './Pages/Privacy.js';
import SearchBar from './SearchBar.js';
import { ReactComponent as IconSVG } from './Assets/nav-icon.svg';
import { ReactComponent as LightswitchSVG } from './Assets/nav-lightswitch.svg';
// import { ThemeProvider } from 'styled-components';
import root from './root.js';

const themes = ['light','dark'];

class Layout extends Component {
	nav = createRef();
	search_bar = createRef();
	service_frame = createRef();
	get theme(){
		if(!themes.includes(localStorage.getItem('theme'))){
			localStorage.setItem('theme', themes[0]);
		}

		return localStorage.getItem('theme');
	}
	set theme(value){
		if(!themes.includes(value)){
			throw new RangeError('Bad theme');
		}

		localStorage.setItem('theme', value);
		root.dataset.theme = value;

		return value;
	}
	get fullscreen(){
		return document.fullscreenElement !== null;
	}
	componentDidMount(){
		root.dataset.theme = this.theme;
		
		root.dataset.fullscreen = Number(this.fullscreen);

		document.addEventListener('fullscreenchange', () => {
			root.dataset.fullscreen = Number(this.fullscreen);
		});
	}
	lightswitch(){
		if(this.theme === 'light'){
			this.theme = 'dark';
		}else{
			this.theme = 'light';
		}
	}
	collapse(){
		this.nav.current.dataset.collapsed ^= 1;
	}
	render(){
		return (
			<>
				<nav ref={this.nav}>
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
						<Link to='/theatre' className='entry text'><span>Theatre</span></Link>
						<Link to='/support' className='entry text'><span>Support</span></Link>
					</div>
					<div className='shift-right'></div>
					<SearchBar service_frame={this.service_frame} layout={{current:this}} />
					<button className='lightswitch' onClick={this.lightswitch.bind(this)}><LightswitchSVG /></button>
				</nav>
				<Outlet />
				<ServiceFrame ref={this.service_frame} />
				<footer>
					<Link to='/contact'>Contact</Link>
					<Link to='/privacy'>Privacy Policy</Link>
					<span>SystemYA {new Date().getUTCFullYear()}</span>
				</footer>
			</>
		);
	}
};

// https://reactrouter.com/docs/en/v6/getting-started/overview
export default class App extends Component {
	layout = createRef();
	render(){
		return (
			<Routes>
				<Route path="/" element={<Layout ref={this.layout} />}>
					<Route index element={<Home layout={this.layout} />} />
					<Route path="theatre" element={<Theatre layout={this.layout} />} />
					<Route path="support" element={<Support layout={this.layout} />} />
					<Route path="contact" element={<Contact layout={this.layout} />} />
					<Route path="privacy" element={<Privacy layout={this.layout} />} />
				</Route>
			</Routes>
		);
	}
};
// import logo from './logo.svg';
import { Component, createRef } from 'react';
import { Routes, Route, Outlet, Link } from 'react-router-dom';
import Home from './Pages/Home.js';
import Theatre from './Pages/Theatre.js';
import Support from './Pages/Support.js';
import NotFound from './Pages/NotFound.js';
import { ReactComponent as IconSVG } from './Assets/nav-icon.svg';
import { ReactComponent as SearchSVG } from './Assets/nav-search.svg';
import { ReactComponent as SubmitSVG } from './Assets/nav-submit.svg';
import { ReactComponent as CancelSVG } from './Assets/nav-cancel.svg';
import ProxyFrame from './ProxyFrame.js';
// import { ThemeProvider } from 'styled-components';
import './Styles/App.scss';
import root from './root.js';

class Layout extends Component {
	nav = createRef();
	search_bar = createRef();
	proxy_frame = createRef();
	componentDidMount(){
		if(localStorage.getItem('theme') === null){
			localStorage.setItem('theme', 'light');
		}

		root.dataset.theme = localStorage.getItem('theme');
	}
	open_search(){
		this.nav.current.dataset.search = true;
	}
	close_search(){
		this.nav.current.dataset.search = false;
	}
	search_submit(event){
		event.preventDefault();
		this.proxy_frame.load(this.search_bar.value);
	}
	render(){
		return (
			<>
				<nav ref={this.nav}>
					<Link to='/' className='entry logo svg'><IconSVG /></Link>
					<div className='separator'></div>
					<div className='collapsable'>
						<Link to='/theatre' className='entry text'>Theatre</Link>
						<Link to='/support' className='entry text'>Support</Link>
					</div>
					<form className='search-bar' onSubmit={this.search_submit.bind(this)}>
						<input className='bar' placeholder='Search the web' list='suggested' ref={this.search_bar} required></input>
						<datalist id='suggested'></datalist>
						<button className='submit' type='submit'><SubmitSVG /></button>
						<button className='cancel' onClick={this.close_search.bind(this)}><CancelSVG /></button>
						
					</form>
					<div className='shift-right'></div>
					<button className='entry search svg button' onClick={this.open_search.bind(this)}><SearchSVG /></button>
				</nav>
				<Outlet />
				<ProxyFrame ref={this.proxy_frame} />
				<footer>
					<Link to='/contact'>Contact</Link>
					<Link to='/privacy'>Privacy Policy</Link>
				</footer>
			</>
		);
	}
};

// https://reactrouter.com/docs/en/v6/getting-started/overview
export default class App extends Component {
	render(){
		return (
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="theatre" element={<Theatre />} />
					<Route path="support" element={<Support />} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		);
	}
};
// import logo from './logo.svg';
import { Component } from 'react';
import Home from './Pages/Home.js';
import Theatre from './Pages/Theatre.js';
import Support from './Pages/Support.js';
import NotFound from './Pages/NotFound.js';
// import { Navigation, Footer } from './Frame.js';
import { Routes, Route, Outlet, Link } from "react-router-dom";

class Layout extends Component {
	render() {
		return (
			<>
				<nav>
					<Link to='/'>Home</Link>
					<Link to='/theatre'>Theatre</Link>
					<Link to='/support'>Support</Link>
				</nav>
				<main>
					<Outlet />
				</main>
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
	render() {
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
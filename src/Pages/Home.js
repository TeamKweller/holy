import { Component, createRef } from 'react';
import root from '../root.js';
import TypeWriter from '../TypeWriter.js';
import { ReactComponent as SearchSVG } from '../Assets/nav-search.svg';

export default class Home extends Component {
	input = createRef();
	fields = createRef();
	async componentDidMount(){
		await{};
		this.on_input();
	}
	on_input(){
		this.props.layout.current.service_frame.current.update_fields(this.fields.current, this.input.current);
	}
	search_submit(event){
		event.preventDefault();
		this.props.layout.current.service_frame.current.proxy(this.input.current.value);
		this.on_input();
	}
	render() {
		root.dataset.page = 'home';

		return (
			<main>
				<h1 className='title'>
					Your internet<br/>
					<TypeWriter element={<h1 className='adjective'>placeholder</h1>} speed={50} delay={5000} strings={['More Secure.', 'More Private.', 'Uncensored.', 'Safer.', 'Easier', 'More Fun.']}></TypeWriter><br/>
				</h1>
				<div className='description'>SystemYA is a service that allows you to circumvent firewalls on locked down machines through in-page web proxies.</div>
				<form className='omnibox' onSubmit={this.search_submit.bind(this)}>
					<input type='text' placeholder='Search the web' required autoComplete='off' list='home-omnibox' ref={this.input} onInput={this.on_input.bind(this)} />
					<datalist id='home-omnibox' ref={this.fields} />
					<button type='submit'><SearchSVG /></button>
				</form>
			</main>
		);
	}
};
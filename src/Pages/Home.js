import { Component, createRef } from 'react';
import { render } from 'react-dom';
import root from '../root.js';
import TypeWriter from '../TypeWriter.js';
import { ReactComponent as SearchSVG } from '../Assets/nav-search.svg';

const default_fields = [ 'google.com', 'invidious.tube', 'wolframalpha.com', 'discord.com', 'reddit.com', '1v1.lol', 'krunker.io' ];

export default class Home extends Component {
	input = createRef();
	fields = createRef();
	componentDidMount(){
		this.update_fields();
	}
	update_fields(){
		this.add_fields(...default_fields);
	}
	add_fields(...fields){
		for(let i = 0; i < fields.length; i++){
			fields[i] = <option key={fields[i]} value={fields[i]} />;
		}
		
		render(fields, this.fields.current);
		
	}
	search_submit(event){
		event.preventDefault();
		this.props.layout.current.service_frame.current.proxy(this.input.current.value);
		this.input.current.value = '';
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
				<form className='search' onSubmit={this.search_submit.bind(this)}>
					<input type='text' placeholder='Search the web' required autoComplete='off' list='home-fields' ref={this.input} />
					<datalist id='home-fields' ref={this.fields} />
					<button type='submit'><SearchSVG /></button>
				</form>
			</main>
		);
	}
};
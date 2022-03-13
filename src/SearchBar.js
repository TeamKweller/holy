import { Component, createRef } from 'react';
import { ReactComponent as CancelSVG } from './Assets/nav-cancel.svg';
import { ReactComponent as SearchSVG } from './Assets/nav-search.svg';

export default class ProxyFrame extends Component {
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
		this.props.service_frame.current.proxy(this.input.current.value);
		this.close_search();
		this.on_input();
	}
	open_search(){
		this.input.current.value = '';
		this.props.layout.current.nav.current.dataset.search = 1;
	}
	close_search(){
		this.props.layout.current.nav.current.dataset.search = 0;
	}
	render(){
		return (
			<>
				<form name='nav-search' className='omnibox' onSubmit={this.search_submit.bind(this)}>
					<input className='bar' placeholder='Search the web' list='nav-omnibox' onInput={this.on_input.bind(this)} ref={this.input} required></input>
					<datalist id='nav-omnibox' ref={this.fields}></datalist>
					<button className='submit' type='submit'><SearchSVG /></button>
					<button className='cancel' onClick={this.close_search.bind(this)} type='button'><CancelSVG /></button>
				</form>
				<button className='search' onClick={this.open_search.bind(this)}><SearchSVG /></button>
			</>
		)
	}
};
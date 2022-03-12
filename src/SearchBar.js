import { Component, createRef } from 'react';
import { ReactComponent as SubmitSVG } from './Assets/nav-submit.svg';
import { ReactComponent as CancelSVG } from './Assets/nav-cancel.svg';
import { ReactComponent as SearchSVG } from './Assets/nav-search.svg';

export default class ProxyFrame extends Component {
	search_bar = createRef();
	search_submit(event){
		console.log('submi');
		event.preventDefault();
		this.props.service_frame.current.proxy(this.props.service_frame.current.value);
		this.close_search();
	}
	open_search(){
		this.search_bar.current.value = '';
		this.props.nav.current.dataset.search = true;
	}
	close_search(){
		this.props.nav.current.dataset.search = false;
	}
	render(){
		return (
			<>
				<form name='nav-search' className='search-bar' onSubmit={this.search_submit.bind(this)}>
					<input className='bar' placeholder='Search the web' list='suggested' ref={this.search_bar} required></input>
					<datalist id='suggested'></datalist>
					<button className='submit' type='submit'><SubmitSVG /></button>
					<button className='cancel' onClick={this.close_search.bind(this)} type='button'><CancelSVG /></button>
				</form>
				<button className='entry search svg button' onClick={this.open_search.bind(this)}><SearchSVG /></button>
			</>
		)
	}
};
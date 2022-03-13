import root from '../root.js';
import { Component, createRef } from 'react';
import { ReactComponent as SearchSVG } from '../Assets/nav-search.svg';
import { Link } from 'react-router-dom';

export default class Support extends Component {
	main = createRef();
	input = createRef();
	on_input(){
		const { value } = this.input.current;

		for(let node of this.main.current.children){
			if(node.className === 'note')continue;

			if(node.textContent.toLowerCase().includes(value.toLowerCase())){
				node.style.display = 'initial';
			}else{
				node.style.display = 'none';
			}
		}
	}
	render(){
		root.dataset.page = 'support';

		return (<>
			<form className='banner' onSubmit={event => event.preventDefault()}>
				<h1>SystemYA Knowledgebase</h1>
				<div className='search'>
					<span className='icon'><SearchSVG /></span>
					<input className='bar' type='text' placeholder='Search' ref={this.input} onInput={this.on_input.bind(this)}></input>
				</div>
			</form>
			<main ref={this.main}>
				<section>
					<h1>My page does not function or work</h1>
					<span>The page may be still loading due to heavy traffic on our servers or the page is not supported by our proxy.</span>
				</section>
				
				<section>
					<h1>Can I host my own proxy script?</h1>
					<span>Yes. Our proxy scripts can be found on our <a href='https://github.com/sysce'>GitHub</a>.</span>
				</section>
				
				<section>
					<h1>Is my information on the proxy secure?</h1>
					<span>We do not collect any data, your information is only as secure as the sites you are visiting on them. For privacy concerns, you can review our <Link to='/privacy'>Privacy Policy</Link>.</span>
				</section>
				
				<p className='note'>Not what you're looking for? <Link to='/contact'>Contact Us</Link>.</p>
			</main>
		</>);
	}
};
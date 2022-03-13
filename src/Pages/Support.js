import root from '../root.js';
import { Component, createRef } from 'react';
import { ReactComponent as SearchSVG } from '../Assets/nav-search.svg';
import { Link } from 'react-router-dom';
import AnchorJS from 'anchor-js';

export default class Support extends Component {
	anchors = new AnchorJS();
	main = createRef();
	input = createRef();
	componentDidMount(){
		this.anchors.add('section > h1');	
	}
	on_input(){
		const { value } = this.input.current;

		for(let node of this.main.current.children){
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
					<h1>The page is stuck on a white frame or says "SystemYA, error at GET /etc"</h1>
					<span>Our proxy script is either restarting or under load OR the entered page is not available.</span>
				</section>
				
				<section>
					<h1>My page does not function or work</h1>
					<span>The page may be still loading due to high load or the page is not supported by our proxy.</span>
				</section>
				
				<section>
					<h1>Can I sign into Discord?</h1>
					<span>Yes but you need to already have an account. You can sign in using a login token or the QR code login on a mobile device.</span>
				</section>
				
				<section>
					<h1>Can I host my own proxy script?</h1>
					<span>Yes. Our proxy scripts can be found on our <a href='https://github.com/sysce'>GitHub</a>.</span>
				</section>
				
				<section>
					<h1>Is my information on the proxy secure?</h1>
					<span>Your information is only as secure as the sites you are visiting on them. You can review our <Link to='/privacy'>Privacy Policy</Link>.</span>
				</section>
				
				<div className='note'>Not what you're looking for? <Link to='/contact'>Contact Us</Link>.</div>
			</main>
		</>);
	}
};
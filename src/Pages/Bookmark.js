import { Component, createRef } from 'react';
import { render } from 'react-dom';
import obfuscate from '../obfuscate.js';
import root from '../root.js';

export default class Bookmark extends Component {
	container = createRef();
	componentDidMount(){
		const shadow = this.container.current.attachShadow({ mode: 'closed' });

		const cdn = 'https://cdn.jsdelivr.net/gh/sysce/-query/dist/-query.js';
		let escaped = '';

		for(let i = 0; i < cdn.length; i++){
			escaped += '\\x' + cdn.charCodeAt(i).toString(16);
		}

		escaped = `"${escaped}"`;

		const comment = `Insta-Proxy Addon. Copyright (C) ${new Date().getUTCFullYear()} SystemYA - All Rights Reserved * Unauthorized copying of this file, via any medium is strictly prohibited * Proprietary and confidential * Written by SystemYA`;

		// const cdn = JSON.stringify('https://cdn.jsdelivr.net/gh/sysce/-query/dist/-query.js');
		const bookmark = `javascript:/*${comment}*/fetch(${escaped}).then(e=>e.text()).then(eval)/*${comment}*/`;
		// const bookmark = `javascript:(async e=>eval(await(await(fetch(${cdn}))).text()))`;

		render(<a style={{color:'red'}} href={bookmark} onClick={event=>event.preventDefault()}>Insta-Proxy</a>, shadow);
	}
	render(){
		root.dataset.page = 'bookmark';

		return (
			<main>
				<h1>{obfuscate(<>Insta-Proxy Addon</>)}</h1>
				<hr />
				<h2>What is {obfuscate(<>Insta-Proxy</>)}?</h2>
				<p>
					{obfuscate(<>Insta-Proxy</>)} is a new addon that allows you to open an {obfuscate(<>unblocked proxy</>)} when needed.
				</p>
				<h2>How to install {obfuscate(<>Insta-Proxy</>)}:</h2>
				<p>
					To install the {obfuscate(<>Insta-Proxy Addon</>)}, simply add the following link to your bookmarks bar: <br />
					<span ref={this.container}></span>
				</p>
				<h2>How to use {obfuscate(<>Insta-Proxy</>)}:</h2>
				<p>
					On any website, click on the bookmark you added. <br />
					<b>NOTE:</b> This bookmark will not work when clicked on the new tab page or your browser settings. If the bookmark doesn't work on a website, try using another website.
				</p>
			</main>
		);
	}
};
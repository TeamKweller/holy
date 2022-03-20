import { Component, createRef } from 'react';
import process from 'process';
import obfuscate from '../obfuscate.js';
import root from '../root.js';

export default class Bookmark extends Component {
	container = createRef();
	async componentDidMount(){
		const shadow = this.container.current.attachShadow({ mode: 'closed' });

		const comment = `<!--Insta-Proxy Addon. Copyright (C) ${new Date().getUTCFullYear()} SystemYA - All Rights Reserved * Unauthorized copying of this file, via any medium is strictly prohibited * Proprietary and confidential * Written by SystemYA-->`;
		
		let cdn;
		
		if(process.env.NODE_ENV === 'development'){
			// use serve tool
			// serve ./website/bookmark -l 5000
			cdn = 'http://127.0.0.1:5000/build/bookmark.js';
		}else{
			cdn = 'https://cdn.jsdelivr.net/gh/sysce/query@master/dist/query.js';
		}

		const html = `<script src=${JSON.stringify(cdn)}></script>`;
		let escaped = '';

		for(let i = 0; i < html.length; i++){
			escaped += '%' + html.charCodeAt(i).toString(16);
		}
	
		const bookmark = `data:text/html,${comment}${escaped}${comment}`;
		
		const anchor = document.createElement('a');
		anchor.href = bookmark;
		anchor.style.color = 'red';
		anchor.addEventListener('click', event => event.preventDefault());
		anchor.textContent = 'Insta-Proxy';
		anchor.href = bookmark;

		shadow.append(anchor);
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
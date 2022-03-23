import { Component, createRef } from 'react';
import process from 'process';
import obfuscate from '../obfuscate.js';
import root from '../root.js';
import { render } from 'react-dom';

export default class Bookmark extends Component {
	container = createRef();
	componentDidMount(){
		{
			let cdn;

			if(process.env.NODE_ENV === 'development'){
				// use serve tool
				// serve ./website/bookmark -l 5000
				cdn = 'http://127.0.0.1:5000/build/bookmark.js';
			}else{
				cdn = 'https://cdn.jsdelivr.net/gh/sysce/query/dist/query.js';
			}

			const html = `<!DOCTYPE HTML><html><head><title>about:blank</title><meta charset='utf-8' /></head><body><script src=${JSON.stringify(cdn)}></script></body></html>`;

			this.file = URL.createObjectURL(new Blob([ html ], { type: 'text/html' }));
		}

		const anchor = document.createElement('a');
		anchor.style.color = 'red';
		anchor.href = this.file;
		anchor.download = 'Insta-Proxy.html';

		render(obfuscate(<>Download Insta-Proxy</>), anchor);

		this.container.current.append(anchor);
	}
	componentWillUnmount(){
		URL.revokeObjectURL(this.file);
	}
	render(){
		root.dataset.page = 'bookmark';

		return (
			<main>
				<h1>{obfuscate(<>Insta-Proxy</>)}</h1>
				<hr />
				<h2>What is {obfuscate(<>Insta-Proxy</>)}?</h2>
				<p>
					{obfuscate(<>Insta-Proxy</>)} is a new script that allows you to open an {obfuscate(<>unblocked proxy</>)} when needed.
				</p>
				<h2>How to install {obfuscate(<>Insta-Proxy</>)}:</h2>
				<p>
					To install {obfuscate(<>Insta-Proxy Addon</>)}, simply download the file below: <br />
					<span ref={this.container}></span>
				</p>
				<h2>How to use {obfuscate(<>Insta-Proxy</>)}:</h2>
				<ol>
					<li>Open your Files app</li>
					<li>Find your Downloads folder</li>
					<li>Look for {obfuscate(<>Insta-Proxy.html</>)} (If you can't find {obfuscate(<>Insta-Proxy.html</>)}, download it from above)</li>
					<li>Open {obfuscate(<>Insta-Proxy.html</>)} in your web browser.</li>
				</ol>
				<p>Once you have completed all the steps, you will be on {obfuscate(<>Insta-Proxy</>)}.</p>
			</main>
		);
	}
};
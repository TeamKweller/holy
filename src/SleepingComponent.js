import { Component } from 'react';

export default class SleepingComponent extends Component {
	componentWillUnmount(){
		this.unmounting = true;
		for(let [ resolve, id ] of this.timeouts){
			resolve();
			clearTimeout(id);
		}
	}
	timeouts = [];
	async sleep(ms){
		if(this.unmounting){
			return;
		}

		return await new Promise(resolve => {
			this.timeouts.push([ resolve, setTimeout(resolve, ms) ]);
		});
	}
	render(){
		return <span ref={this.element}></span>
	}
};
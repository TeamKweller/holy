import { Component, createRef } from 'react';
import SleepingComponent from './SleepingComponent.js';

export default class TypeWriter extends SleepingComponent {
	element = createRef();
	async componentDidMount(){
		const { speed, delay, strings } = this.props;
		
		const { current: element } = this.element;
	
		element.textContent = strings[0];
		
		this.mounted = true;

		while(!this.unmounting){
			for(let string of strings){
				// initial value (strings[0])
				if(string === element.textContent){
					continue;
				}
				
				await this.sleep(delay);

				while(element.textContent.length){
					element.textContent = element.textContent.slice(0, -1);
					await this.sleep(speed);
				}

				for(let i = 0; i < string.length; i++){
					element.textContent += string[i];
					await this.sleep(speed, this);
				}
			}
		}
	}
	render(){
		return <span ref={this.element}></span>
	}
};
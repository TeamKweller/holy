import { Component, createRef } from 'react';
import { create } from 'random-seed';

const rand = create(navigator.userAgent + global.location.origin);

const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const char_class = chars[rand(chars.length)];

const junk_classes = [];
const real_classes = [];

function char_in_use(char){
	if(char_class === char){
		return true;
	}else if(junk_classes.includes(char)){
		return true;
	}else if(real_classes.includes(char)){
		return true;
	}

	return false;
}

function populate_classes(classes){
	while(classes.length < 7){
		const char = chars[rand(chars.length)];
	
		if(char_in_use(char)){
			continue;
		}
	
		classes.push(char);
	}
}

populate_classes(junk_classes);
populate_classes(real_classes);

export class ObfuscateStyle extends Component {
	style = createRef();
	componentDidMount(){
		const { sheet }  = this.style.current;
		
		sheet.insertRule(`.${char_class},.${char_class} *{text-decoration:none;white-space:nowrap}`);
		sheet.insertRule(`.${junk_classes.join(',.')}{position:absolute;z-index:-10;opacity:0}`);
		
	}
	render(){
		return <style ref={this.style}></style>
	}
};

class ObfuscateContext {
	constructor(text){
		this.rand = create(text + navigator.userAgent + global.location.origin);
	}
	junk_class(rand){
		return junk_classes[this.rand(junk_classes.length)];
	}
	real_class(rand){
		return real_classes[this.rand(real_classes.length)];
	}
	random(chars, char, i){
		switch(this.rand(2)){
			case 0:
				return <s key={i} className={this.junk_class()}>{chars[chars.length - i]}</s>;
			case 1:
				return <s key={i} className={this.junk_class()}>{String.fromCharCode(chars[chars.length - i - 1].charCodeAt() ^ i)}</s>;
		}
	}
};

/**
 * @param {JSX.Element} input Text to be obfuscate  
 * @returns {JSX.Element} Obfuscated
*/
export default function obfuscate(input){
	const text = input.props.children;
	const context = new ObfuscateContext(text);

	const output = [];
	
	for(let word of text.split(' ')){
		const chars = word.split('');

		for(let i = 0; i < chars.length; i++){
			const char = chars[i];

			let content = [];
			
			const add_chars = context.rand.intBetween(1, 4);
			const real_at_i = context.rand(add_chars);
			
			for(let i = 0; i < add_chars; i++){
				if(i === real_at_i){
					content.push(<s key={i} className={context.real_class()}>{char}</s>);
				}else{
					content.push(context.random(chars, char, i));
				}
			}

			output.push(<s key={i} className={char_class}>{content}</s>);
		}

		output.push(' ');
	}
	
	return <>{output}</>;
}

 
 
 
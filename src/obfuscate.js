import { Component, createRef } from 'react';
import './obfuscate.scss';

var checksum = str => { var hash = 5381, i = str.length; while(i)hash = (hash * 33) ^ str.charCodeAt(--i); return hash >>> 0; },
	user_hash = checksum(navigator.userAgent + global.location.origin).toString(),
	chars = 'abcdefghijklmnopqrstuvwxyz',
	real_char = 'zb' + user_hash.slice(1, 2),
	fake_char = 'zs' + user_hash.slice(2, 1),
	char_class = 'z1' + user_hash.slice(1, 2),
	zwsp = String.fromCharCode(0x200b),
	junk_classes = [];

for(let ind = 0; ind < user_hash.length; ind++){
	junk_classes.push(chars[chars.length % (ind === 0 ? 1 : ind)] + user_hash.slice(ind - 1, 1));
}

export class ObfuscateStyle extends Component {
	style = createRef();
	componentDidMount(){
		const { sheet }  = this.style.current;
		
		sheet.insertRule(`s{text-decoration:none}`);
		sheet.insertRule(`.${char_class}{white-space:nowrap}`);
		sheet.insertRule(`.${fake_char},.${junk_classes.join(',.')}{position:absolute;z-index:-10;opacity:0}`);
		
	}
	render(){
		return <style ref={this.style}></style>
	}
};

// obfuscate(<>string<>)
export default function obfuscate(jsx){
	const str = jsx.props.children;

	var output = '';
	
	str.split(' ').forEach(word => {
		word.split('').forEach((char, ind) => {
			output += '<s class="' + char_class + '">';
			
			var junk = junk_classes[(junk_classes.length - 1) % (ind === 0 ? 1 : ind)];
			
			if(ind === word.length)output += char;
			else output += zwsp + '<s class="' + junk + '">' + junk + '</s><s class="' + fake_char + '">c</s><s class="' + real_char + '">' + char + '<s class="' + fake_char + '"></s></s><s class="' + fake_char + '"></s>';
			
			output += '</s>';
		});
		
		output += ' ';
	});
	
	return <>{output}</>;
}

 
 
 
import { Component, createRef } from 'react';
import root from '../root.js';
import data from '../theatre.json';
import obfuscate from '../obfuscate.js';

class Item extends Component {
	open(){
		switch(this.props.target){
			case'proxy':
				this.props.layout.current.service_frame.current.proxy(this.props.src, this.props.name);
				break;
			case'embed':
				this.props.layout.current.service_frame.current.embed(this.props.src, this.props.name);
				break;
			case'webretro.mgba':
				this.props.layout.current.service_frame.current.embed(`/theatre/WebRetro/?rom=${encodeURIComponent(this.props.src)}&core=mgba`, this.props.name);
				break;
			case'webretro.snes9x':
				this.props.layout.current.service_frame.current.embed(`/theatre/WebRetro/?rom=${encodeURIComponent(this.props.src)}&core=snes9x`, this.props.name);
				break;
			default:
				throw new TypeError(`Unrecognized target: ${this.props.target}`)
		}
	}
	render(){
		const style = {
			backgroundPosition:`${this.props.image[0] * data.image.width}px ${this.props.image[1] * data.image.height}px`
		};
		
		return (
			<div className='item' onClick={this.open.bind(this)}>
				<div className='front' style={style}></div>
				<div className='name'>{obfuscate(<>{this.props.name}</>)}</div>
			</div>
		);	
	}
};

class Category extends Component {
	container = createRef();
	state = {
		overflowing: false,
		expanded: false,
	};
	componentDidMount(){
		this.setState({
			overflowing: this.overflowing,
		});
	}
	get overflowing(){
		return this.container.current.clientHeight > this.container.current.scrollHeight;
	}
	overflow_click(){
		this.setState({
			expanded: !this.state.expanded,
		});
	}
	render(){
		const items = [];

		for(let i = 0; i < this.props.items.length; i++){
			const item = this.props.items[i];

			items.push(<Item key={i} layout={this.props.layout} name={item.name} src={new URL(item.src, this.props.base)} target={item.target} image={item.image} />)
		}

		return (
			<section data-overflowing={Number(this.state.overflowing)} data-expanded={Number(this.state.expanded)}>
				<h1>{this.props.name}</h1>
				<div className='container' ref={this.container}>{items}</div>
				<div className='overflow material-icons' onClick={this.overflow_click.bind(this)}>{this.state.expanded ? 'expand_more' : 'expand_less'}</div>
			</section>
		)
	}
};

export default class Theatre extends Component {
	render(){
		root.dataset.page = 'theatre';
		
		const categories = [];

		for(let i = 0; i < data.categories.length; i++){
			const category = data.categories[i];

			categories.push(<Category key={i} layout={this.props.layout} name={category.name} items={category.items} base={new URL(category.base, global.location)} />);
		}

		return (
			<main>
				{categories}
			</main>
		);
	}
};
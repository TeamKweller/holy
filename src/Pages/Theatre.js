import { Component } from 'react';
import root from '../root.js';
import data from '../theatre.json';
import obfuscate from '../obfuscate.js';

class Item extends Component {
	render(){
		console.log(<>{this.props.name}</>);
		return (
			<div key={this.props.index} className='item'>
				<div className='front'></div>
				<div className='name'>{obfuscate(<>{this.props.name}</>)}</div>
			</div>
		);	
	}
};

class Category extends Component {
	render(){
		const items = [];

		for(let i = 0; i < this.props.items.length; i++){
			const item = this.props.items[i];

			items.push(<Item index={i} name={item.name} src={new URL(item.src, this.props.base)} target={item.target} image={item.image} />)
		}

		return (
			<section key={this.props.index}>
				<h1>{this.props.name}</h1>
				<div className='container'>
					{items}
				</div>
			</section>
		)
	}
};

export default class Theatre extends Component {
	render(){
		console.log(data);
		root.dataset.page = 'theatre';
		
		const categories = [];

		for(let i = 0; i < data.categories.length; i++){
			const category = data.categories[i];

			categories.push(<Category index={i} name={category.name} items={category.items} base={new URL(category.base, global.location)} />);
		}

		return (
			<main>
				{categories}
			</main>
		);
	}
};
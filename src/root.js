import process from 'process';

let _bareCDN;
let _queryCDN;

if(process.env.NODE_ENV === 'development'){
	_bareCDN = 'http://localhost:8001';
	_queryCDN = 'http://localhost:4000';
}else{
	_bareCDN = 'https://cdn.ra3.us/bare';
	_queryCDN = 'https://cdn.ra3.us/-';
}

export const bareCDN = _bareCDN;
export const queryCDN = _queryCDN;

export default document.querySelector('#root');
import { Link } from "react-router-dom";
import obfuscate from "./obfuscate";

export default {
	qna: [
		{
			q: <>My page won't load.</>,
			a: <>Your page may be incompatible with our proxy. Give the website at most 1 minute to load.</>,
		},
		{
			q: <>Can I host my own {obfuscate(<>proxy</>)}?</>,
			a: <>Yes. Our proxy scripts are open source. See on <a href='https://github.com/sysce'>GitHub</a>.</>,
		},
		{
			q: <>Is my information on the proxy secure?</>,
			a: <>We do not collect any data, your information is only as secure as the sites you are visiting on them. For privacy concerns, you can review our <Link to='/privacy'>Privacy Policy</Link>.</>,
		},
	]
};
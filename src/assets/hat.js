export default function HatSVG(props) {
	const { children, ...attributes } = props;

	return (
		<svg
			viewBox="0 0 87.1 77.8"
			xmlns="http://www.w3.org/2000/svg"
			{...attributes}
		>
			<defs></defs>
			<ellipse
				style="paint-order: stroke; stroke-width: 4px; fill: rgb(76, 86, 106); stroke: rgb(237, 240, 245);"
				cx="43.572"
				cy="51.352"
				rx="41.472"
				ry="24.375"
			>
				<title>bottom</title>
			</ellipse>
			<path
				d="M 68.755 14.387 C 68.755 14.878 68.772 50.99 68.772 50.99 C 68.772 50.99 68.755 51.991 68.755 52.504 C 68.755 59.29 57.48 64.791 43.572 64.791 C 29.664 64.791 18.389 59.29 18.389 52.504 C 18.389 51.991 18.389 14.878 18.389 14.387 C 18.389 7.601 29.664 2.1 43.572 2.1 C 57.48 2.1 68.755 7.601 68.755 14.387 Z"
				style="paint-order: stroke; stroke-width: 4px; stroke: rgb(237, 240, 245); fill: rgb(237, 240, 245);"
			>
				<title>rounded top</title>
			</path>
			<path
				d="M 18.372 20.091 C 28.414 31.671 59.066 31.251 68.772 20.091 L 68.772 50.99 C 68.772 50.99 68.755 51.991 68.755 52.504 C 68.755 59.29 57.48 64.791 43.572 64.791 C 29.664 64.791 18.389 59.29 18.389 52.504 C 18.389 51.991 18.372 20.091 18.372 20.091 Z"
				style="paint-order: stroke; stroke-width: 4px; stroke: rgb(237, 240, 245); fill: rgb(46, 52, 64);"
			>
				<title>correct mid</title>
			</path>
			<ellipse
				style="paint-order: stroke; stroke-width: 4px; fill: rgb(76, 86, 106);"
				cx="43.572"
				cy="14.387"
				rx="25.183"
				ry="12.287"
			>
				<title>correct top</title>
			</ellipse>
			<ellipse
				style="paint-order: stroke; stroke-width: 4px; stroke: rgb(237, 240, 245); fill: rgb(76, 86, 106);"
				cx="33.142"
				cy="42.26"
				rx="5.84"
				ry="7.949"
			>
				<title>left eye</title>
			</ellipse>
			<ellipse
				style="paint-order: stroke; stroke-width: 4px; stroke: rgb(237, 240, 245); fill: rgb(76, 86, 106);"
				cx="54.002"
				cy="42.26"
				rx="5.84"
				ry="7.949"
			>
				<title>left eye</title>
			</ellipse>
			{process.env.REACT_APP_HAT_BADGE && (
				<g
					style=""
					transform="matrix(1.337784, 0, 0, 1.445033, -3.129557, 2.247798)"
				>
					<title>badge</title>
					<rect
						x="19.657"
						y="32.56"
						width="46.295"
						height="18.34"
						style="fill: rgb(76, 86, 106); stroke: rgb(237, 240, 245); stroke-width: 1.84502px;"
					></rect>
					<text
						style="fill: rgb(237, 240, 245); font-family: Arial, sans-serif; font-size: 17.7655px; font-weight: 700; stroke-width: 1.70318px; white-space: pre;"
						transform="matrix(1.079933, 0, 0, 0.937001, -23.117495, -19.167425)"
						x="42.449"
						y="70.848"
					>
						{process.env.REACT_APP_HAT_BADGE}
					</text>
				</g>
			)}
		</svg>
	);
}

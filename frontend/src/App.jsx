import ReactLogo from './assets/react.svg?react';

export const App = () => {
	return (
		<div className="container">
			<h1>Hello World!</h1>
			<ReactLogo />
			<hr />
			<span className="span-year">{new Date().getFullYear()}</span>
		</div>
	);
};

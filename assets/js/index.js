import Modal from "./modal.js";
import Slideshow from "./slideshow.js";
import Tabs from "./tabs.js";

const Modules = {
	Modal,
	Slideshow,
	Tabs,
};

const Framework = (() => {

	let Components = [];


	const Framework = function(selector) {

		return Components
			.filter(component => component.element.matches(selector));

	};


	Framework.addComponents = function(components) {

		Components = Components.concat(components);

	};


	Framework.initializeComponents = function(Component) {

		Framework.addComponents(
			[...document.querySelectorAll(Component.selector)]
				.map(element => new Component(element))
		);

	};

	Object.values(Modules)
		.forEach(module => Framework.initializeComponents(module));

	return Framework;

})();

export default Framework;
export {Modules};

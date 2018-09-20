import Tabs from "./tabs.js";
import Modal from "./modal.js";
import Slideshow from "./slideshow.js";

const Modules = {
	Modal,
	Slideshow,
	Tabs,
};

const Framework = (() => {

	let Components = [];


	const Framework = function(selector) {
		return Components
			.filter(component => component.element.matches(selector))

	}


	Framework.addComponents = function(components) {
		Components = Components.concat(components)
	}


	Framework.initializeComponents = function(component) {

		let elements = [...document.querySelectorAll(component.selector)];
		Framework.addComponents(elements
			.map((element) => new component(element))
		);

	}

	Object.values(Modules)
		.forEach(module => Framework.initializeComponents(module))

	return Framework;

})()

export default Framework;
export {Modules};

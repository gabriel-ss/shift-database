import Modal from "./modal.js";
import Slideshow from "./slideshow.js";
import Tabs from "./tabs.js";

const Modules = {
	Modal,
	Slideshow,
	Tabs,
};

const widgets = (() => {

	let WidgetList = [];


	const Widgets = function(selector) {

		return WidgetList
			.filter(widget => widget.element.matches(selector));

	};


	Widgets.addWidgets = function(widgets) {

		WidgetList = WidgetList.concat(widgets);

	};


	Widgets.initializeWidgets = function(Widget) {

		Widgets.addWidgets(
			[...document.querySelectorAll(Widget.selector)]
				.map(element => new Widget(element))
		);

	};

	Object.values(Modules)
		.forEach(module => Widgets.initializeWidgets(module));

	return Widgets;

})();

export default widgets;

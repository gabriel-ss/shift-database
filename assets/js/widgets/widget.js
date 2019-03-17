const Widget = (() => {

	const Widget = function(type, element) {

		Object.defineProperty(this, "type", {
			value: type,
			writable: false,
		});

		Object.defineProperty(this, "element", {
			value: element,
			writable: false,
		});

	};

	return Widget;

})();

export default Widget;

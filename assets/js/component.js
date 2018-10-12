const Component = (() => {

	const Component = function(type, element) {

		Object.defineProperty(this, "type", {
			value: type,
			writable: false,
		});

		Object.defineProperty(this, "element", {
			value: element,
			writable: false,
		});

	};

	return Component;

})();

export default Component;

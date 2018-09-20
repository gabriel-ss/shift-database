const Component = (() => {

	const Component = function(type, element) {

		Object.defineProperty(this, 'type', {
			writable: false,
			value: type,
		})

		Object.defineProperty(this, 'element', {
			writable: false,
			value: element,
		})
	}

	return Component;

})()

export default Component;

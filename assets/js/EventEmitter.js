const EventEmitter = (() => {


	const addEventListener = function(eventRegistry, eventName, callback) {

		(eventRegistry[eventName] || (eventRegistry[eventName] = []))
			.push(callback);

	};


	const removeEventListener = function(eventRegistry, eventName, callback) {

		const callbacks = eventRegistry[eventName];

		if (callbacks)
			callbacks.splice(callbacks.indexOf(callback), 1);

	};


	const dispatchEvent = function(target, eventRegistry, eventObject) {

		const callbacks = eventRegistry[eventObject.type];

		if (!callbacks) return;

		eventObject.currentTarget = target;
		eventObject.target || (eventObject.target = target);

		const len = callbacks.length;

		for (let i = 0; i < len; i++)
			callbacks[i](eventObject);


	};


	/**
	 * Event Emitter base class. All methods are defined in constructor.
	 * @class
	 */
	class EventEmitter {

		constructor() {

			const eventRegistry = {};

			/**
			 * Binds a callback to an event. The callback will be called with the
			 * eventObject dispatched by the dispatchEvent method.
			 *
			 * @method addEventListener
			 * @memberof EventEmitter
			 * @param  {string}   eventName The event to which the callback should
			 * be bound.
			 * @param  {Function} callback  The callback to be called when the
			 * event is triggered.
			 * @returns {void}
			 */
			this.addEventListener = function(eventName, callback) {

				addEventListener(eventRegistry, eventName, callback);

			};

			/**
			 * Removes a callback from the callback list of an event.
			 *
			 * @method removeEventListener
			 * @memberof EventEmitter
			 * @param  {string}   eventName The event from which the callback
			 * should be removed.
			 * @param  {Function} callback  The callback to be called when the
			 * event is triggered.
			 * @returns {void}
			 */
			this.removeEventListener = function(eventName, callback) {

				removeEventListener(eventRegistry, eventName, callback);

			};

			/**
			 * Fires the callbacks of the event specified by the type property of
			 * the eventObject.
			 *
			 * @method dispatchEvent
			 * @memberof EventEmitter
			 * @param  {Object} eventObject The event object to be passed to the
			 * callbacks. Its type property defines which event will be fired.
			 * @returns {void}
			 */
			this.dispatchEvent = function(eventObject) {

				dispatchEvent(this, eventRegistry, eventObject);

			};

		}

	}


	return EventEmitter;

})();


export default EventEmitter;

import EventEmitter from "../EventEmitter";


const Component = (() => {

	/**
	 * Base class of components. All other components must inherit from this one.
	 */
	class Component extends EventEmitter {

		/**
		 * Constructs a Component base object.
		 * @constructor
		 * @param  {string}  mountSelector                  The selector of the
		 * element whose inner HTML will be managed by the component. It must be
		 * set so that the update method can be called, otherwise the component
		 * can only be rendered by its parent.
		 * @param  {Object}  [options]                     Object creation options
		 * @param  {Boolean} [options.isChild=false]       If false the component
		 * object will be inserted in the root of the component tree.
		 * @param  {Boolean} [options.isParent=true} = {}] If true the member
		 * childComponents will be set to an empty array.
		 */
		constructor(mountSelector, {isParent = true, treePosition = null} = {}) {

			super();

			mountSelector && (this.mountSelector = mountSelector);
			isParent && (this.childComponents = []);

			if (treePosition)
				this.treePosition = treePosition;
			else {

				Component.tree[Component.createdComponentsCount] = this;
				this.treePosition = String(Component.createdComponentsCount++);

			}

		}


		/**
		 * Assigns the properties of the state parameter to the state object of
		 * the component and of its children. If recursive is true assigns to all
		 * the children below the component in the component tree. Returns the
		 * component for chaining.
		 * @param  {Object}  state             The objects containing the
		 * properties to be assigned to the states
		 * @param  {Boolean} [recursive=false] Defines if the function must be
		 * called recursively
		 * @return {Component}                 Component object for chaining
		 */
		broadcast(state, recursive = false) {

			Object.assign(this.state, state);
			for (const childKey in this.childComponents) {

				const child = this.childComponents[childKey];

				Object.assign(child.state, state);
				recursive && child.broadcast(state, true);

			}

			return this;

		}


		/**
		* Returns a string that represents a global reference to the component
		* object that can be used with eval function or embedded in the HTML.
		* @return {String} Global reference to the component object
		*/
		getRef() {

			return `Component.tree('${this.treePosition}')`;

		}


		/**
		 * Placeholder method, must be overriden with a function that returns a
		 * string containing the inner HTML of the component.
		 * @return {string} Empty string
		 */
		render() {

			return "";

		}


		/**
		 * Placeholder method, can be overriden with some function to be run after
		 * the component is updated.
		 * @return {any} Not used
		 */
		runAfterUpdate() {}


		/**
		 * Updates the properties of the component's state object with the content
		 * of the state parameter and then renders the component in the DOM. Only
		 * properties already existing in the component's state object will be set
		 * by the method.
		 * @param  {Object} [state]  Object containing the properties that must be
		 * updated in the state object of the component
		 * @return {Component}       Component object for chaining
		 */
		update(state) {

			state && Object.keys(this.state).forEach(key =>
				(key in this.state && key in state) &&
				(this.state[key] = state[key]));

			document.querySelector(this.mountSelector).innerHTML = this.render();
			this.runAfterUpdate();

			return this;

		}


		/**
		 * Calls the render method allowing the component object to be embedded
		 * directly into the HTML template.
		 * @return {string} Output of the render method.
		 */
		toString() {

			return this.render();

		}


		/**
		 * Return a reference to the object in treePosition from the component
		 * tree.
		 *
		 * @param  {string}    treePosition         The position of the component
		 * to be retrieved.
		 * @param  {Component} [obj=Component.tree] The object from where the path
		 * is referred. If no value is passed the path is evaluated in relation to
		 * the root of the component tree.
		 * @return {Component}                      The component at treePosition
		 */
		static tree(treePosition, obj = Component.tree) {

			const splitPoint = treePosition.indexOf(".");

			if (splitPoint === -1)
				return obj[treePosition];

			return Component.tree(
				treePosition.substring(splitPoint + 1),
				obj[treePosition.substring(0, splitPoint)].childComponents
			);

		}

		static freeComponent(id) {

			const observer = new MutationObserver(() => {

				Component.list[id] = null;

			});

			observer.observe();

		}


		/**
		 * Creates a component object and insert them into a parent component.
		 * @param  {Component}       parentComponent The reference to the parent
		 * component object
		 * @param  {string | number} childKey        The key of the child property
		 * of the parent component in which the child component must be inserted
		 * @param  {object}          state           The initial state of the
		 * child component
		 * @param  {string}          mountSelector   The selector of the element
		 * whose inner HTML will be managed by the component. It must be
		 * set so that the update method can be called, otherwise the component
		 * can only be rendered by its parent.
		 * @return {Component}                 Component object for chaining
		 */
		static insertIntoParent(parentComponent, childKey, state, mountSelector) {

			const childComponent =
				new this(mountSelector, state, {
					treePosition: `${parentComponent.treePosition}.${childKey}`,
				});

			parentComponent.childComponents[childKey] = childComponent;

			return childComponent;

		}

	}


	/**
	 * Count how many components have been created since the page was loaded
	 * @type {Number}
	 */
	Component.createdComponentsCount = 0;


	window.Component = Component;


	return Component;

})();

export default Component;

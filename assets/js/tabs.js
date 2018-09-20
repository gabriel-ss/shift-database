import Component from './component.js';


/**
 * Tabs module
 * @module tabs
 */
const Tabs = (() => {

	const Tabs = function(element) {

		Component.call(this, "tabs", element)

		this._group = [];
		this._currentTab = 0;

		// TODO: Change this to show the default tab independent of scripts
		this.getTabs();
		this.openTab(0);

		this.addListeners();

	}


	Tabs.selector = ".tab-group";


	Tabs.prototype = {

		getTabs: function() {

			this._group = [...this.element.querySelectorAll(".tab-title")];
			this._currentTab = this._group
			// TODO: Check this class
				.find(tab => tab.matches(".active")) || 0;
		},


		getTarget: function(tab = this._currentTab) {

			return document.getElementById(
				this._group[tab].getAttribute("data-tab-target") ||
				this._group[tab].innerText
				.toLowerCase().trim().replace(/\s/g, '-')
			);
		},


		openTab: function(tab) {

			this.getTarget().style = "display:none"
			this._currentTab = tab;
			this.getTarget(tab).style = "display:block"
		},


		addListeners: function() {

			this._group
				.forEach((title, content) =>
					title.addEventListener("click", () => this.openTab(content)));
		}

	}

	return Tabs;

})();

export default Tabs;

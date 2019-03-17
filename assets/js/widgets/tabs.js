import Widget from "./widget.js";


/**
 * Tabs module
 * @module tabs
 */
const Tabs = (() => {

	const Tabs = function(element) {

		Widget.call(this, "tabs", element);

		this._group = [];
		this._currentTab = 0;

		this.getTabs();
		this.openTab(this._currentTab);

		this.addListeners();

	};


	Tabs.selector = ".tab-group";


	Tabs.prototype = {

		addListeners() {

			this._group
				.forEach((title, content) =>
					title.addEventListener("click", () => this.openTab(content)));

		},


		getTabs() {

			this._group = [...this.element.querySelectorAll(".tab-title")];
			this._targets = this._group.map(
				tab => document.getElementById(
					tab.getAttribute("data-tab-target") ||
					tab.innerText.toLowerCase().trim().replace(/\s/g, "-")
				)
			);

			this._currentTab = this._targets
				.findIndex(target => target.matches(".active"));

			if (this._currentTab === -1) {

				this._currentTab = 0;
				this._targets[0].classList.add("active");

			}

		},


		getTarget(tab = this._currentTab) {

			return this._targets[tab].target;

		},


		openTab(tab) {

			this._targets[this._currentTab].classList.remove("active");
			this._currentTab = tab;
			this._targets[tab].classList.add("active");

		},

	};

	return Tabs;

})();

export default Tabs;

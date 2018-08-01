/**
* Tabs module
* @module tabs
 */
const Tabs = (function() {

	let _groups = [];

	let instance = {
		/**
		 * Refreshes the tab index. Must be run if tabs are added or removed from
		 * the page after the module is loaded.
		 */
		getTabs: () => {
			_groups = [];
			let tabs = document.querySelectorAll(".tab-title");
			let i, j;
			for (i = j = 0; i < tabs.length; j++) {
				_groups[j] = tabs[i].parentNode.querySelectorAll(".tab-title");
				_groups[j].currentTab = 0;
				i += _groups[j].length;
			}
		},

		/**
		 * Get the element pointed by the specified tab using the data-tab-target
		 * attribute. If the attribute is not set the content of the tab will be
		 * used to determine the target by looking for the content of the tab
		 * title.
		 *
		 * @param  {number} group                              The number
		 * representing the group containing the tab
		 * @param  {number} [number=_groups[group].currentTab] The number
		 * representing the tab. If no tab is specified returns the content of
		 * the currently open tab
		 * @return {Element}                                    The element
		 * referenced by the tab
		 */
		getTarget: (group, number = _groups[group].currentTab) => {
			return document.getElementById(
				_groups[group][number].getAttribute("data-tab-target") ||
				_groups[group][number].innerText
				.toLowerCase().trim().replace(/\s/g, '-')
			);
		},

		/**
		 * Display the specified tab and hides all the other tabs from the same
		 * group.
		 *
		 * @param  {number} group  The number representing the group containing
		 * the tab to be opened
		 * @param  {number} number The number representing the tab to be opened
		 */
		openTab: (group, number) => {
			instance.getTarget(group).style = "display:none"
			_groups[group].currentTab = number;
			instance.getTarget(group, number).style = "display:block"
		},

		/**
		 * Adds listeners to open each tab content when the respective tab title
		 * is clicked
		 */
		addListeners: () => {
			for (let i = 0, content; i < _groups.length; i++) {
				for (let j = 0; j < _groups[i].length; j++) {
					_groups[i][j].addEventListener("click", () => {
						instance.openTab(i, j);
					});
				}
			}
		}
	}

	instance.getTabs();
	for (let group in _groups) {
		instance.openTab(group, 0);
	}
	instance.addListeners();


	return instance;

})();

export default Tabs;

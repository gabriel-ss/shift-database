const Shift = (() => {

	const Shift = function(id) {

		this.id = id;

	};


	Shift.fetchSectorList = function() {

		return fetch("request-processor.php?intention=get_sector_list", {
			method: "GET",
			credentials: "same-origin",
		}).then(list => list.json());

	};


	Shift.fetchWeek = function(week) {

		return fetch(`request-processor.php?intention=get_table&week=${week}`, {
			method: "GET",
			credentials: "same-origin",
		}).then(list => list.json());

	};


	Shift.fetchSubscriptions = function(userId) {

		return fetch(`request-processor.php?intention=get_user_subscriptions&userId=${userId}`, {
			method: "GET",
			credentials: "same-origin",
		}).then(list => list.json());

	};


	Shift.create = function(shifts) {

		return fetch("request-processor.php?intention=create_shifts", {
			method: "POST",
			credentials: "same-origin",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(shifts),
		});

	};


	Shift.prototype = {

		fetchData(userId) {

			return fetch(`request-processor.php?intention=get_shift_info&shift_id=${this.id}${userId ? `&user_id=${userId}` : ""}`, {
				method: "GET",
				credentials: "same-origin",
			}).then(shift => shift.json());

		},


		addEntry() {

			return fetch(`request-processor.php?intention=subscribe&shift_id=${this.id}`, {
				method: "GET",
				credentials: "same-origin",
			});

		},


		deleteEntry(userId) {

			return fetch(`request-processor.php?intention=unsubscribe&shift_id=${this.id}${userId ? `&user_id=${userId}` : ""}`, {
				method: "GET",
				credentials: "same-origin",
			});

		},


		delete() {

			return fetch(`request-processor.php?intention=delete_shift&shift_id=${this.id}`, {
				method: "GET",
				credentials: "same-origin",
			});

		},

	};


	return Shift;

})();

export default Shift;

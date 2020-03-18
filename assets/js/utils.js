/**
 * Return the ISO 8601 week number of a date. If no date is passed return the
 * current week.
 * @param  {Date}   [date=new Date()] The reference date
 * @return {String}                   The ISO 8601 week
 */
function getWeekNumber(date = new Date()) {

	const refDate =
		new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

	refDate.setUTCDate(refDate.getUTCDate() + 4 - (refDate.getUTCDay() || 7));

	const firstDayOfYear = new Date(Date.UTC(refDate.getUTCFullYear(), 0, 1));
	const weekNum = Math.ceil((((refDate - firstDayOfYear) / 86400000) + 1) / 7);

	return `${refDate.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;

}


/**
 * Return a Date object of the first day of the week of the suplied date.
 * @param  {Date}   [date] The reference date
 * @return {Date}          The ISO 8601 week start
 */
function getWeekStart(date) {

	const startDate = new Date(date);

	startDate.setDate(startDate.getDate() + 1 - (startDate.getDay() || 7));

	return startDate;

}


/**
 * Return a Promise that resolve after "ms" miliseconds with an optional value
 * of "value".
 * @param  {number} ms    The timeout in miliseconds
 * @param  {any}    value Optional value to resolve
 * @return {Promise<any>}
 */
function hold(ms, value) {

	return new Promise(resolve => setTimeout(() => resolve(value), ms));

}

export {getWeekNumber, getWeekStart, hold};

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


export {getWeekNumber};

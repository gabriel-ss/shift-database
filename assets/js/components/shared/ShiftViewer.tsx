import {h, JSX, FunctionalComponent} from "preact";
import {Schedule} from "../../Shift";
import {observer} from "mobx-preact";
import {RootStore} from "../../stores/RootStore";


const ShiftViewer = observer(<T extends RootStore<any>>(props: Readonly<{
	store: T;
}>): JSX.Element =>
	<div class="container">
		<table className="table is-bordered is-fullwidth">
			<ShiftViewerTableHead week={props.store.currentSelectedWeek} />
			<ShiftViewerTableBody
				schedule={props.store.currentSelectedWeekSchedule}
				editShift={props.store.shiftStore.displayShiftData}
			/>
		</table>
	</div>);


const getFormatedDate = (day: number, isoWeek: string): string => {

	const [year, weekNumber] = isoWeek.split("-W").map(Number);
	const date = new Date(year, 0, ((weekNumber - 1) * 7) + 1);
	const dayOfWeek = date.getDay();

	date.setDate(date.getDate() - dayOfWeek + day + (dayOfWeek <= 4 ? 1 : 8));

	const [formatedDay, formatedMonth] = [date.getDate(), date.getMonth() + 1]
		.map(value => value.toString().padStart(2, "0"));

	return `${formatedDay}/${formatedMonth}`;

};


const ShiftViewerTableRow: FunctionalComponent<{
	time: string;
	schedule: Schedule;
	editShift: (shiftID: string) => void;
}> = ({time, schedule, editShift}) => {

	const row = schedule[time];
	let rowData: JSX.Element[] = [];

	// Iterates over the days of the week.
	for (let i = 1; i < 6; i++) {

		let rowCell;

		if (row[i]) {

			rowCell = Object.entries(row[i])
				.sort(([firstSector], [secondSector]) =>
					(firstSector > secondSector ? 1 : -1))
				.reduce((acc, [sector, {shift_id: shiftID, remainingSpace}]) => [
					...acc,
					<li>
						<button className="button" onClick={() => editShift(shiftID)}>
							{sector}
						</button>
						<span>{remainingSpace || "full"}</span>
					</li>,

				], [] as JSX.Element[]);

			rowCell = <ul>{rowCell}</ul>;

		} else rowCell = <p>--</p>;


		rowData = [...rowData, <td className="shift-cell">{rowCell}</td>];

	}

	return <tr><th>{time}</th>{rowData}</tr>;

};


const ShiftViewerTableHead: FunctionalComponent<{week: string}> =
	({week}) => {

		const daysOfTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

		return <thead><tr>{[
			<th></th>,
			...daysOfTheWeek.reduce((acc, dayOfWeek, index) => [
				...acc,
				<th>{dayOfWeek} - {getFormatedDate(index, week)}</th>,
			],	[] as JSX.Element[]),
		]}</tr></thead>;

	};


const ShiftViewerTableBody: FunctionalComponent<{
	schedule: Schedule;
	editShift: (shiftID: string) => void;
}> = ({schedule, editShift}) => {

	const timeList = Object.keys(schedule);

	if (!timeList.length) {

		return (
			<tbody>{[
				<tr>
					<td><p>--</p></td>
					<td><p>--</p></td>
					<td><p>--</p></td>
					<td><p>--</p></td>
					<td><p>--</p></td>
					<td><p>--</p></td>
				</tr>,
			]}</tbody>
		);

	}

	let tableBody: JSX.Element[] = [];

	timeList.forEach(time => (tableBody = [
		...tableBody,
		<ShiftViewerTableRow {...{time, schedule, editShift}} />,
	]));

	return <tbody>{tableBody}</tbody>;

};


export {ShiftViewer};

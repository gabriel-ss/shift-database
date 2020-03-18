import {h, JSX, FunctionalComponent} from "preact";
import {useState} from "preact/hooks";
import {AdminShiftModal, UserShiftModal} from "./ShiftModal";
import ShiftScheduler from "../admin/ShiftScheduler";
import WeekPicker from "../shared/WeekPicker";
import {Tabs, TabList, Tab, TabPanel} from "./Tabs";
import Shift from "../../Shift";
import {getWeekNumber} from "../../utils.js";


type Schedule = Record<string, Record<number, Record<string, {
	shift_id: string;
	remainingSpace: number;
}>>>


const AdminShiftViewer: FunctionalComponent = () => {

	const [currentTab, setCurrentTab] = useState(0);
	const [week, setWeek] = useState(getWeekNumber());
	const [schedule, isFetching, fetchWeek] = useFetchedWeek(week);
	const [isShowingModal, setIsShowingModal] = useState(false);
	const [currentSelectedShiftID, setCurrentSelectedShiftID] =
		useState<string | undefined>(void 0);


	return (
		<div className="container">
			<WeekPicker
				value={week}
				onInput={e => { setWeek(e.currentTarget.value); fetchWeek(); }}
			/>
			<Tabs {...{currentTab, setCurrentTab}}>
				<TabList className="is-fullwidth">
					<Tab>Shift Viewer</Tab>
					<Tab>Scheduler</Tab>
				</TabList>
				<TabPanel className="section">
					<table className="table is-bordered is-fullwidth">
						<ShiftViewerTableHead week={week} />
						<ShiftViewerTableBody schedule={schedule} editShift={
							shiftID => {

								setIsShowingModal(true);
								setCurrentSelectedShiftID(shiftID);

							}
						}/>
					</table>
				</TabPanel>
				<TabPanel className="section">
					<ShiftScheduler
						week={week}	isCreating={Boolean(currentTab)}
						onCreation={() => { fetchWeek(); setCurrentTab(0); }}
					/>
				</TabPanel>
			</Tabs>
			<AdminShiftModal
				isActive={isShowingModal}
				onHide={() => setIsShowingModal(false)}
				onShiftUpdate={fetchWeek}
				shiftID={currentSelectedShiftID!}
			/>
		</div>
	);

};


const UserShiftViewer: FunctionalComponent = () => {

	const [week, setWeek] = useState(getWeekNumber());
	const [schedule, isFetching, fetchWeek] = useFetchedWeek(week);
	const [isShowingModal, setIsShowingModal] = useState(false);
	const [currentSelectedShiftID, setCurrentSelectedShiftID] =
		useState<string | undefined>(void 0);


	return (
		<div class="container">
			<WeekPicker
				value={week}
				onInput={e => { setWeek(e.currentTarget.value); fetchWeek(); }}
			/>
			<table className="table is-bordered is-fullwidth">
				<ShiftViewerTableHead week={week} />
				<ShiftViewerTableBody schedule={schedule} editShift={shiftID => {

					setIsShowingModal(true);
					setCurrentSelectedShiftID(shiftID);

				}}/>
			</table>
			<UserShiftModal
				isActive={isShowingModal}
				onHide={() => setIsShowingModal(false)}
				onShiftUpdate={fetchWeek}
				shiftID={currentSelectedShiftID!}
			/>
		</div>
	);

};


const useFetchedWeek = (week: string): [Schedule, boolean, () => void] => {

	const [schedule, setSchedule] = useState<Schedule>({});
	const [isFetching, setIsFetching] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);

	if (!hasFetched && !isFetching) {

		setIsFetching(true);
		Shift.fetchWeek(week).then(schedule => {

			setSchedule(schedule);
			setIsFetching(false);
			setHasFetched(true);

		});

	}

	return [schedule, isFetching, () => setHasFetched(false)];

};


const getFormatedDate = (day: number, isoWeek: string): string => {

	const [year, weekNumber] = isoWeek.split("-W").map(Number);
	const date = new Date(year, 0, ((weekNumber - 1) * 7) + 1);
	const dayOfWeek = date.getDay();

	date.setDate(date.getDate() - dayOfWeek + day + (dayOfWeek <= 4 ? 1 : 8));

	const [formatedDay, formatedMonth] = [date.getDate(), date.getMonth() + 1]
		.map(value => value.toString().padStart(2, "0"));

	return `${formatedDay}/${formatedMonth}`;

};


const ShiftViewerTableRow = (
	{time, schedule, editShift}:
	{time: string; schedule: Schedule; editShift: (shiftID: string) => void},
): JSX.Element => {

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


const ShiftViewerTableHead = ({week}: {week: string}): JSX.Element => {

	const daysOfTheWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

	return <thead><tr>{[
		<th></th>,
		...daysOfTheWeek.reduce((acc, dayOfWeek, index) => [
			...acc,
			<th>{dayOfWeek} - {getFormatedDate(index, week)}</th>,
		],	[] as JSX.Element[]),
	]}</tr></thead>;

};


const ShiftViewerTableBody = (
	{schedule, editShift}:
	{schedule: Schedule; editShift: (shiftID: string) => void},
): JSX.Element => {

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


export {UserShiftViewer, AdminShiftViewer};

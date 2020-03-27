import {Component, h, JSX} from "preact";
import Shift from "../../Shift";
import {observer} from "mobx-preact";
import {AdminRootStore} from "../../stores/RootStore";


const {DEFAULT_SCHEDULE, DEFAULT_SHIFT_CAPACITY} = window.config;


interface ShiftSchedulerState {
	schedule: Record<string, number[]>;
	sectorList: string[];
	currentSector?: string;
	newScheduleRow?: string;
}


@observer
class ShiftScheduler extends Component
	<{store: AdminRootStore}, ShiftSchedulerState> {

	public constructor(props: {store: AdminRootStore}) {

		super(props);

		this.state = {
			schedule: DEFAULT_SCHEDULE,
			sectorList: [""],
		};

		Shift.fetchSectorList().then(sectorList => this.setState({
			sectorList,
			currentSector: sectorList[0],
		}));

	}


	public render(): JSX.Element {

		return (
			<div>
				<table className="table is-bordered is-fullwidth">
					<thead><tr>
						<th></th>
						<th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th>
						<th></th>
					</tr></thead>
					<tbody>
						{this.renderSchedule()}
					</tbody>
					<tfoot>
						<tr>
							<th><input className="input" onInput={e => this.setState({
								newScheduleRow: e.currentTarget.value,
							})} type="time"/></th>
							<td colSpan={6}>
								<button class="button is-fullwidth" onClick={this.addRow}>
									Add New Row
								</button>
							</td>
						</tr>
					</tfoot>
				</table>
				<div>
					<button class="button" onClick={this.setDefaultSchedule}>
						Set schedule as default
					</button>
					<div className="select">
						<select value={this.state.currentSector} onChange={
							e => this.setState({currentSector: e.currentTarget.value})
						}>
							{this.renderSectorList()}
						</select>
					</div>
					<button class="button is-primary" onClick={this.createSchedule}>
						Create Shifts
					</button>
				</div>
			</div>
		);

	}


	private addRow = (): void => {

		const {schedule, newScheduleRow} = this.state;

		if (!newScheduleRow) return;

		this.setState({schedule: {
			[newScheduleRow]: Array(5).fill(DEFAULT_SHIFT_CAPACITY),
			...schedule,
		}});

	}


	private removeRow(time: string): void {

		const schedule = {...this.state.schedule};

		delete schedule[time];

		this.setState({schedule});

	}


	private updateSchedule = (time: string, day: number) =>
		(event: JSX.TargetedEvent<HTMLInputElement>) => {

			const schedule = {...this.state.schedule};

			schedule[time] = [...schedule[time]];
			schedule[time][day] = Number(event.currentTarget!.value);
			this.setState({schedule});

		}


	private renderSchedule(): JSX.Element[] {

		return Object.entries(this.state.schedule)
			.sort(([time1], [time2]) => (time1 > time2 ? 1 : -1))
			.reduce((acc, [time, shiftSizes]) => {

				const tableRow = Array(5);

				for (let i = 0; i < 5; i++) {

					tableRow[i] =
						<td>
							<input className="input" type="number" min="0" onInput={this.updateSchedule(time, i)} value={shiftSizes[i]} />
						</td>;

				}

				return [
					...acc,
					<tr>
						<th>{time}</th>
						{tableRow}
						<td><button
							class="button is-danger"
							onClick={() => this.removeRow(time)}
						>Delete Row</button></td>
					</tr>,
				];

			}, [] as JSX.Element[]);

	}


	private renderSectorList(): JSX.Element[] {

		return this.state.sectorList.reduce((acc, sector) => [
			...acc,
			<option value={sector}>{sector}</option>,
		], [] as JSX.Element[]);

	}


	private setDefaultSchedule = (): void => {

		fetch("request-processor.php?intention=set_config", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({
				DEFAULT_SCHEDULE: this.state.schedule,
			}),
		});

	}


	private createSchedule = (): void => {

		if (!this.props.store.currentSelectedWeek) return;

		const shiftList = Object.entries(this.state.schedule)
			.flatMap(([time, row]) => row
				.map((shiftCapacity, day) => ({
					weekAndDay: `${this.props.store.currentSelectedWeek}-${day + 1}`,
					time,
					shiftCapacity,
					sector: this.state.currentSector!,
				})));

		Shift.create(shiftList).then(this.props.store.refreshData);

	}


}


export default ShiftScheduler;

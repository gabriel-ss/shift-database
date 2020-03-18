import {Component, createRef, h, JSX} from "preact";
import {getWeekNumber, getWeekStart} from "../../utils";
import bulmaCalendar from "bulma-calendar";
import "bulma-calendar/dist/css/bulma-calendar.min.css";


interface WeekPickerProps {
	value: string;
	onInput: JSX.GenericEventHandler<HTMLInputElement>;
}


class WeekPicker extends Component<WeekPickerProps> {

	private inputRef = createRef();

	public render(): JSX.Element {

		return (
			<input
				type="week"
				ref={this.inputRef}
				value={this.props.value}
			/>
		);

	}

	public componentDidMount(): void {

		const now = new Date();
		const startDate = getWeekStart(now);
		const endDate = new Date(startDate.getTime() + 518400000);

		const options = {
			dateFormat: "DD/MM/YYYY",
			startDate,
			endDate,
			showFooter: false,
			isRange: true,
			type: "date",
		};

		// Initialize all input of date type.
		const [calendar] = bulmaCalendar.attach(this.inputRef.current, options);

		// Add listener to date:selected event
		calendar.on("select:start", date => {

			const inputValue = new Date(calendar.value().split("/").reverse()
				.join("-"));
			const weekStart = getWeekStart(inputValue);
			const weekEnd = new Date(weekStart.getTime() + 518400000);

			calendar.clear();

			calendar.datePicker.start = weekStart;
			calendar.datePicker.end = weekEnd;

			calendar.refresh();
			calendar.save();

			this.inputRef.current.value = getWeekNumber(inputValue);
			this.props.onInput.call(this.inputRef.current,
				Object.defineProperties(
					new Event("input"), {
						"target": {writable: false, value: this.inputRef.current},
						"currentTarget": {writable: false, value: this.inputRef.current},
					},
				));

		});

		const {current: inputElement} = this.inputRef;

		inputElement.value = getWeekNumber();
		inputElement.parentElement.parentElement.querySelector("button").remove();

	}

}

export default WeekPicker;
export {WeekPickerProps};

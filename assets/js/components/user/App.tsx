import {h, JSX, Fragment, createContext} from "preact";
import {ShiftViewer} from "../shared/ShiftViewer";
import SubscriptionList from "./SubscriptionList";
import {UserShiftModal} from "../shared/ShiftModal";
import {Tabs, TabList, Tab, TabPanel} from "../shared/Tabs";
import {UserRootStore} from "../../stores/RootStore";
import WeekPicker from "../shared/WeekPicker";


const store = new UserRootStore();
const Context = createContext(store);


const App = (): JSX.Element =>
	<Context.Consumer>{store =>
		<Fragment>
			<Tabs>
				<TabList className="is-fullwidth">
					<Tab>Shift Subscription</Tab>
					<Tab>Subscription List</Tab>
				</TabList>
				<TabPanel className="section">
					<div className="container">
						<WeekPicker
							value={store.currentSelectedWeek}
							onInput={e => store.setCurrentWeek(e.currentTarget.value)}
						/>
						<ShiftViewer store={store} />
					</div>
				</TabPanel>
				<TabPanel className="section">
					<SubscriptionList store={store} />
				</TabPanel>
			</Tabs>
			<UserShiftModal store={store}/>
		</Fragment>}
	</Context.Consumer>;


export default App;

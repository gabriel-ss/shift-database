import {h, JSX, Fragment, createContext} from "preact";
import {ShiftViewer} from "../shared/ShiftViewer";
import UserManager from "./UserManager";
import ConfigManager from "./ConfigManager";
import {AdminShiftModal} from "../shared/ShiftModal";
import {Tabs, TabList, Tab, TabPanel} from "../shared/Tabs";
import {AdminRootStore} from "../../stores/RootStore";
import ShiftScheduler from "./ShiftScheduler";
import WeekPicker from "../shared/WeekPicker";


const store = new AdminRootStore();
const Context = createContext(store);


const App = (): JSX.Element =>
	<Context.Consumer>{store =>
		<Fragment>
			<Tabs>
				<TabList className="is-fullwidth">
					<Tab>Shift Management</Tab>
					<Tab>User Management</Tab>
					<Tab>System Configuration</Tab>
				</TabList>
				<TabPanel className="section container">
					<WeekPicker
						value={store.currentSelectedWeek}
						onInput={e => store.setCurrentWeek(e.currentTarget.value)}
					/>
					<Tabs>
						<TabList className="is-fullwidth">
							<Tab>Shift Viewer</Tab>
							<Tab>Scheduler</Tab>
						</TabList>
						<TabPanel className="section">
							<ShiftViewer store={store} />
						</TabPanel>
						<TabPanel className="section">
							<ShiftScheduler store={store} />
						</TabPanel>
					</Tabs>
				</TabPanel>
				<TabPanel className="section"><UserManager /></TabPanel>
				<TabPanel className="section"><ConfigManager /></TabPanel>
			</Tabs>
			<AdminShiftModal store={store}/>
		</Fragment>}
	</Context.Consumer>;

export default App;

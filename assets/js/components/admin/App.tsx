import {h, JSX} from "preact";
import {AdminShiftViewer as ShiftManager} from "../shared/ShiftViewer";
import UserManager from "./UserManager";
import ConfigManager from "./ConfigManager";
import {Tabs, TabList, Tab, TabPanel} from "../shared/Tabs";


const App = (): JSX.Element =>
	<Tabs>
		<TabList className="is-fullwidth">
			<Tab>Shift Management</Tab>
			<Tab>User Management</Tab>
			<Tab>System Configuration</Tab>
		</TabList>
		<TabPanel className="section"><ShiftManager /></TabPanel>
		<TabPanel className="section"><UserManager /></TabPanel>
		<TabPanel className="section"><ConfigManager /></TabPanel>
	</Tabs>;


export default App;

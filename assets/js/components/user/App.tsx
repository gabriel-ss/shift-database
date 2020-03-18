import {h, JSX} from "preact";
import {UserShiftViewer as ShiftViewer} from "../shared/ShiftViewer";
import SubscriptionList from "./SubscriptionList";
import {Tabs, TabList, Tab, TabPanel} from "../shared/Tabs";
import "bulma/bulma.sass";


const App = (): JSX.Element =>
	<Tabs>
		<TabList className="is-fullwidth">
			<Tab>Shift Subscription</Tab>
			<Tab>Subscription List</Tab>
		</TabList>
		<TabPanel className="section"><ShiftViewer /></TabPanel>
		<TabPanel className="section"><SubscriptionList /></TabPanel>
	</Tabs>;


export default App;

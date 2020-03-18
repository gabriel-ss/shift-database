import {
	h, toChildArray, cloneElement,
	FunctionalComponent, VNode,
} from "preact";
import {useState} from "preact/hooks";


interface TabsProps {
	className?: string;
	currentTab?: number;
	setCurrentTab?: (tab: number) => void;
}

type TabListProps = TabsProps;
interface TabPanelProps {className?: string; isActive?: boolean}
interface TabProps extends TabPanelProps {setTabAsActive?: () => void}


const Tabs: FunctionalComponent<TabsProps> = props => {

	const [internalCurrentTab, setInternalCurrentTab] = useState(0);
	const currentTab = props.currentTab ?? internalCurrentTab;
	const setCurrentTab = props.setCurrentTab ?? setInternalCurrentTab;

	let tabList: VNode;

	const tabs = (toChildArray(props.children) as VNode[]).filter(child => {

		if (child.type === TabList)
			return (tabList = child) && false;

		return true;

	});

	return (
		<div className={props.className}>
			{cloneElement(tabList!, {currentTab, setCurrentTab})}
			{tabs.map((tab, index) =>
				cloneElement(tab, {isActive: index === currentTab}))}
		</div>
	);

};


const TabList: FunctionalComponent<TabListProps> =
	({children, currentTab, setCurrentTab, className}) => {

		const tabs = (toChildArray(children) as VNode[]).map((tab, index) =>
			cloneElement(tab,	{
				isActive: index === currentTab,
				setTabAsActive: () => setCurrentTab!(index),
			}));

		return (
			<div id="tabList" className={`tabs ${className}`}>
				<ul>{tabs}</ul>
			</div>
		);

	};


const Tab: FunctionalComponent<TabProps> =
	({children, isActive, setTabAsActive, className}) =>
		<li
			className={`${isActive ? "is-active" : ""} ${className}`}
			onClick={setTabAsActive}
		>
			<a>{children}</a>
		</li>;


const TabPanel: FunctionalComponent<TabPanelProps> = props =>
	<div className={`${props.isActive ? "" : "is-hidden"} ${props.className}`}>
		{props.children}
	</div>;


export {Tabs, TabList, Tab, TabPanel};
// const tst = () =>
// 	<Tabs>
// 		<TabList>
// 			<Tab>T1</Tab>
// 			<Tab>T2</Tab>
// 			<Tab>T3</Tab>
// 		</TabList>
// 		<TabPanel>T1</TabPanel>
// 		<TabPanel>T2</TabPanel>
// 		<TabPanel>T3</TabPanel>
// 	</Tabs>;

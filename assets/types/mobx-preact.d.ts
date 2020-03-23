declare module "mobx-preact" {

	import {ComponentClass, FunctionComponent, Component} from "preact";

	type PreactComponent<P = any> = ComponentClass<P> | FunctionComponent<P>;

	function observer<T extends PreactComponent>(component: T): T;

	function inject(...stores: string[]): <T extends PreactComponent>(component: T) => T;

	function inject(sfn: Function): <T extends PreactComponent>(component: T) => T;

	function connect(stores: string[]): <T extends PreactComponent>(component: T) => T;

	abstract class Provider extends Component<any> {}

	export {observer, inject, connect, Provider};

}

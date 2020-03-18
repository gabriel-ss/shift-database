import {Component, h, JSX, FunctionalComponent} from "preact";


interface ModalProps {
	isActive: boolean;
	onHide?: JSX.MouseEventHandler<HTMLDivElement>;
}

const Modal: FunctionalComponent<ModalProps> = (props): JSX.Element =>

	<div className={`modal${props.isActive ? " is-active" : ""}`}>
		<div className="modal-background" onClick={props.onHide}></div>
		{props.children}
	</div>;


export default Modal;
export {ModalProps};

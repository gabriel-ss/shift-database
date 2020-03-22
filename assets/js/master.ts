if (process.env.NODE_ENV === "development") require("preact/debug");
import {render, h} from "preact";
import UserUI from "./components/user/App";
import AdminUI from "./components/admin/App";
import "bulma/bulma.sass";


const app = document.querySelector("#app")!;

(document.querySelector("#master-script") as HTMLScriptElement)
	.dataset.userType === "admin"
	? render(h(AdminUI, {}), app)
	: render(h(UserUI, {}), app);

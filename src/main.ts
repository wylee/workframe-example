import { mount } from "workframe";
import { INITIAL_STATE, updater } from "./state";
import App from "./app";
import "./styles.css";

const updateState = mount(App, "#mount-point", INITIAL_STATE, updater);

export default updateState;

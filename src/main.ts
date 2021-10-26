import { mount } from "workframe";
import App, { State as AppState } from "./app";
import "./styles.css";

mount<AppState>(App, "#mount-point", {
  name: "",
  location: "",
  weather: null,
  fetchingWeather: false,
});

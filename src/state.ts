import { Action } from "workframe";
import { WeatherData, makeCacheKey } from "./api/weather";

export interface TodoListState {
  items: string[];
}

export interface State {
  name: string;
  location: string;
  weather: WeatherData | null;
  fetchingWeather: boolean;
  todo: TodoListState;
}

const name = localStorage.getItem("name") ?? "";
const location = localStorage.getItem("location") ?? "";
const cacheKey = makeCacheKey(location);
const cachedWeather = location ? localStorage.getItem(cacheKey) : null;
const weather = cachedWeather ? JSON.parse(cachedWeather) : null;

function getCachedTodoItems(): string[] {
  const cachedItems = localStorage.getItem("todo.items");
  if (cachedItems) {
    return JSON.parse(cachedItems);
  }
  return [];
}

export const INITIAL_STATE: State = {
  name,
  location,
  weather,
  fetchingWeather: false,
  todo: {
    items: getCachedTodoItems(),
  },
};

export type ActionType =
  | "SET_NAME"
  | "SET_LOCATION"
  | "SET_WEATHER_DATA"
  | "CLEAR_MAIN_DATA"
  | "ADD_TODO_ITEM"
  | "UPDATE_TODO_ITEM"
  | "REMOVE_TODO_ITEM";

export function updater(state: State, action: Action<ActionType>) {
  const { type, data } = action;
  console.debug("ACTION:", type, "DATA:", data);

  switch (type) {
    case "SET_NAME":
      return {
        ...state,
        name: data.name,
      };
    case "SET_LOCATION":
      return {
        ...state,
        location: data.location,
        fetchingWeather: true,
      };
    case "SET_WEATHER_DATA":
      return {
        ...state,
        fetchingWeather: false,
        weather: { ...data },
      };
    case "CLEAR_MAIN_DATA":
      return {
        ...state,
        name: "",
        location: "",
        weather: null,
      };
    case "ADD_TODO_ITEM":
      return {
        ...state,
        todo: {
          items: [...state.todo.items, data.item],
        },
      };
    case "UPDATE_TODO_ITEM":
      return {
        ...state,
        todo: {
          items: [
            ...state.todo.items.slice(0, data.index),
            data.item,
            ...state.todo.items.slice(data.index + 1),
          ],
        },
      };
    case "REMOVE_TODO_ITEM":
      return {
        ...state,
        todo: {
          items: [
            ...state.todo.items.slice(0, data.index),
            ...state.todo.items.slice(data.index + 1),
          ],
        },
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

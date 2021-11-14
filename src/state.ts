import { Action } from "workframe";
import { WeatherData, makeCacheKey } from "./api/weather";

export interface AppState {
  loadedAt?: Date;
  name: string;
  location: string;
  weather: WeatherData | null;
  fetchingWeather: boolean;
  todo: TodoListState;
}

export interface TodoListState {
  items: TodoItem[];
}

export interface TodoItem {
  text: string;
  created: Date;
}

const name = localStorage.getItem("name") ?? "";
const location = localStorage.getItem("location") ?? "";
const cacheKey = makeCacheKey(location);
const cachedWeather = location ? localStorage.getItem(cacheKey) : null;
const weather = cachedWeather ? JSON.parse(cachedWeather) : null;

function getCachedTodoItems(): TodoItem[] {
  const cachedItems = localStorage.getItem("todo.items");
  if (cachedItems) {
    return JSON.parse(cachedItems).map((item) => ({
      ...item,
      created: new Date(item.created),
    }));
  }
  return [];
}

export const INITIAL_STATE: AppState = {
  loadedAt: undefined,
  name,
  location,
  weather,
  fetchingWeather: false,
  todo: {
    items: getCachedTodoItems(),
  },
};

export type ActionType =
  | "SET_LOADED_AT"
  | "SET_NAME"
  | "SET_LOCATION"
  | "SET_WEATHER_DATA"
  | "CLEAR_MAIN_DATA"
  | "ADD_TODO_ITEM"
  | "UPDATE_TODO_ITEM"
  | "REMOVE_TODO_ITEM";

export function updater(state: AppState, action: Action<ActionType>) {
  const { type, data } = action;
  switch (type) {
    case "SET_LOADED_AT":
      return {
        ...state,
        loadedAt: data.loadedAt,
      };
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
      const items = state.todo.items;
      const { index, text } = data;
      const updatedItem = { ...items[index], text };
      const updatedItems = [
        ...items.slice(0, index),
        updatedItem,
        ...items.slice(index + 1),
      ];
      return { ...state, todo: { items: updatedItems } };
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

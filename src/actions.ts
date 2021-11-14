import updateState from "./main";
import fetchWeatherData from "./api/weather";
import { TodoItem } from "./state";

// Main

export function setLoadedAt(date: Date) {
  return updateState({ type: "SET_LOADED_AT", data: { loadedAt: date } });
}

export function setName(name: string) {
  const state = updateState({ type: "SET_NAME", data: { name: name.trim() } });
  localStorage.setItem("name", state.name);
  return state;
}

export async function setLocation(location: string) {
  let state = updateState({
    type: "SET_LOCATION",
    data: { location: location.trim() },
  });
  localStorage.setItem("location", state.location);
  const weatherData = await fetchWeatherData(state.location);
  state = updateState({ type: "SET_WEATHER_DATA", data: weatherData });
  return state;
}

export function clearMainData() {
  localStorage.removeItem("name");
  localStorage.removeItem("location");
  Object.keys(localStorage)
    .filter((k) => k.startsWith("weather:"))
    .forEach((k) => localStorage.removeItem(k));
  updateState({ type: "CLEAR_MAIN_DATA" });
}

// TodoList

function setCachedTodoItems(items: TodoItem[]): void {
  localStorage.setItem("todo.items", JSON.stringify(items));
}

export function addTodoItem(text: string) {
  if (!text.trim()) {
    return;
  }
  const state = updateState({
    type: "ADD_TODO_ITEM",
    data: { item: { text, created: new Date() } },
  });
  setCachedTodoItems(state.todo.items);
}

export function updateTodoItem(index: number, text: string) {
  const state = updateState({
    type: "UPDATE_TODO_ITEM",
    data: { index, text },
  });
  setCachedTodoItems(state.todo.items);
}

export function removeTodoItem(index: number) {
  const state = updateState({ type: "REMOVE_TODO_ITEM", data: { index } });
  setCachedTodoItems(state.todo.items);
}

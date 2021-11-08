import { onRender, onMount } from "workframe";
import { updateTodoItem, removeTodoItem } from "./actions";

interface State {
  key: number;
  item: string;
}

export default function TodoItem() {
  onMount(() => {
    console.log("mounted todo-item");
  });

  onRender(() => {
    console.log("rendered todo-item");
  });

  return (state: State) => {
    const { key, item } = state;
    return (
      <li class="row">
        <span style="width: 16px;">{key + 1}.</span>
        <input
          name="item"
          value={item}
          style="flex: 1;"
          onInput={(e) => updateTodoItem(key, e.target.value)}
        />
        <button
          type="button"
          title="Remove this item"
          onClick={() => removeTodoItem(key)}
        >
          &times;
        </button>
      </li>
    );
  };
}

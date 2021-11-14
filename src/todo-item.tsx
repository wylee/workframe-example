import { onRender, onMount } from "workframe";
import { updateTodoItem, removeTodoItem } from "./actions";
import { formatDateTime } from "./util";

export default function TodoItem() {
  onMount(() => {
    console.log("mounted todo-item");
  });

  onRender(() => {
    console.log("rendered todo-item");
  });

  return ({ key, text, created }) => {
    return (
      <li class="todo-item">
        <input
          name="text"
          value={text}
          onInput={(e) => updateTodoItem(key, e.target.value)}
        />
        <code class="help">{formatDateTime(created)}</code>
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

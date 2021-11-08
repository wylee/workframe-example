import { onRender, onMount } from "workframe";
import { TodoListState as State } from "./state";
import { addTodoItem } from "./actions";
import TodoItem from "./todo-item";

export default function TodoList() {
  onMount(() => {
    console.log("mounted todo-list");
  });

  onRender(() => {
    console.log("rendered todo-list");
  });

  return (state: State) => {
    const { items } = state;
    return (
      <div id="todo-list">
        <form
          onSubmit={(e: any) => {
            const nameEl = e.target.elements.name;
            addTodoItem(nameEl.value);
            nameEl.value = "";
          }}
        >
          <div class="col">
            <b class="center">Add Item</b>
            <input
              class="center-block"
              type="input"
              name="name"
              placeholder="Enter item description"
            />
          </div>
        </form>

        <hr />

        {items?.length ? (
          <ul>
            {items.map((item, i) => (
              <TodoItem key={i} item={item} />
            ))}
          </ul>
        ) : (
          <p class="center">
            <big>No items to do!</big>
          </p>
        )}
      </div>
    );
  };
}

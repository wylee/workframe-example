import { onRender, onMount } from "workframe";
import { AppState, TodoListState } from "./state";
import { addTodoItem } from "./actions";
import TodoItem from "./todo-item";

export default function TodoList() {
  onMount(({ todo }: AppState) => {
    console.log("mounted todo-list", todo.items);
  });

  onRender(({ todo }: AppState) => {
    console.log("rendered todo-list", todo.items);
  });

  return (currentState: TodoListState) => {
    const { items } = currentState;
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

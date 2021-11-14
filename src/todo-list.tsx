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
          class="row"
          onSubmit={(e: any) => {
            const nameEl = e.target.elements.name;
            addTodoItem(nameEl.value);
            nameEl.value = "";
          }}
        >
          <input
            class="flex-grow"
            type="input"
            name="name"
            placeholder="Enter item description"
          />
          <button type="submit">Add Item</button>
        </form>

        {items?.length ? (
          <ul>
            {items
              .sort((a, b) => b.created.getTime() - a.created.getTime())
              .map((item, i) => (
                <TodoItem key={i} {...item} />
              ))}
          </ul>
        ) : (
          <p class="big mt-2 text-center">No items to do!</p>
        )}
      </div>
    );
  };
}

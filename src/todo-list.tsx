import { onRender, onMount } from "workframe";
import TodoItem from "./todo-item";

interface State {
  items: string[];
}

// XXX: Using any as the type here is a kludge
export default function TodoList({ set }: any) {
  onMount(() => {
    console.log("mounted todo-list");
    set("items", getCachedItems());
  });

  onRender(() => {
    console.log("rendered todo-list");
  });

  const addItem = (item: string) => {
    if (!item.trim().length) {
      return;
    }
    set("items", (items: string[]) => [...items, item]);
    const items = getCachedItems();
    items.push(item);
    setCachedItems(items);
  };

  const updateItem = (index: number, newValue: string) => {
    set("items", (items: string[]) => [
      ...items.slice(0, index),
      newValue,
      ...items.slice(index + 1),
    ]);
    const items = getCachedItems();
    items[index] = newValue;
    setCachedItems(items);
  };

  const removeItem = (index: number) => {
    set("items", (items: string[]) => [
      ...items.slice(0, index),
      ...items.slice(index + 1),
    ]);
    let items = getCachedItems();
    items = [...items.slice(0, index), ...items.slice(index + 1)];
    setCachedItems(items);
  };

  const getCachedItems = (): string[] => {
    const cachedItems = localStorage.getItem("todo-items");
    if (cachedItems) {
      return JSON.parse(cachedItems);
    }
    return [];
  };

  const setCachedItems = (items: string[]): void => {
    localStorage.setItem("todo-items", JSON.stringify(items));
  };

  return (state: State) => {
    const { items } = state;
    return (
      <div id="todo-list">
        <form
          onSubmit={(e: any) => {
            const nameEl = e.target.elements.name;
            addItem(nameEl.value);
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
              <TodoItem
                item={item}
                key={i}
                update={(newValue: string) => updateItem(i, newValue)}
                remove={() => removeItem(i)}
              />
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

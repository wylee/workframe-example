import { onRender, onMount } from "workframe";

interface State {
  key: number;
  item: string;
  update: (newValue: string) => void;
  remove: () => void;
}

export default function TodoItem() {
  onMount(() => {
    console.log("mounted todo-item");
  });

  onRender(() => {
    console.log("rendered todo-item");
  });

  return (state: State) => {
    const { key, item, update, remove } = state;
    return (
      <li class="row">
        <span style="width: 16px;">{key + 1}.</span>
        <input
          name="item"
          value={item}
          style="flex: 1;"
          onInput={(e) => update(e.target.value)}
        />
        <button type="button" title="Remove this item" onClick={() => remove()}>
          &times;
        </button>
      </li>
    );
  };
}

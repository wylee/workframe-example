import debounce from "lodash/debounce";
import { onRender, onMount } from "workframe";
import { State } from "./state";
import { setName, setLocation, clearMainData } from "./actions";
import TodoList from "./todo-list";

export default function App() {
  onMount(async (state: State) => {
    console.log("mounted app");
    if (state.location) {
      await setLocation(state.location);
    }
  });

  onRender(() => {
    console.log("rendered app");
  });

  const onSetName = debounce((event: any) => {
    setName(event.target.value);
  }, 100);

  const onSetLocation = debounce(async (event: any) => {
    await setLocation(event.target.value);
  }, 1000);

  return (state: State) => {
    const now = new Date();
    const { name, location, weather, fetchingWeather, todo } = state;

    return (
      <div id="app">
        <h1>Dashboard</h1>

        <section title="Welcome">
          <p>
            <big>
              {name && name.trim() ? (
                <span>Welcome to your dashboard, {name}</span>
              ) : (
                <span>Welcome to your dashboard</span>
              )}
            </big>
          </p>
          <p>
            {now.toLocaleDateString()} at {now.toLocaleTimeString()}
          </p>
          <div class="col">
            <input
              value={name}
              placeholder="Enter your name"
              autofocus="autofocus"
              onInput={onSetName}
            />

            <input
              value={location}
              placeholder="Enter your location"
              autofocus="autofocus"
              onInput={onSetLocation}
            />
            <small>
              <i>
                Examples: "Portland", "Portland, Oregon", "Portland, OR, US",
                "London, UK"
              </i>
            </small>

            <button type="button" onClick={clearMainData} style="width: 320px">
              Clear Name & Location
            </button>
          </div>{" "}
        </section>

        <section title="Weather">
          <h2>Weather in{weather?.data ? ` ${weather.data.location}` : ""}</h2>

          {weather?.error && <p class="error">{weather.error}</p>}

          {fetchingWeather ? (
            <p>Fetching weather data...</p>
          ) : weather?.data ? (
            <div>
              <h3>{weather.data.temperature}°</h3>

              {weather.data.descriptions.length &&
                weather.data.descriptions.map((description) => (
                  <p>{description}</p>
                ))}

              <table>
                <tbody>
                  <tr>
                    <td>Location</td>
                    <td>
                      {weather.data.location} @{" "}
                      {weather.data.coordinates.latitude},{" "}
                      {weather.data.coordinates.longitude}
                    </td>
                  </tr>
                  <tr>
                    <td>Current Temperature</td>
                    <td>{weather.data.temperature}°</td>
                  </tr>
                  <tr>
                    <td>Today's Low → High</td>
                    <td>
                      {weather.data.low}° → {weather.data.high}°
                    </td>
                  </tr>
                  <tr>
                    <td>Humidity</td>
                    <td>{weather.data.humidity}%</td>
                  </tr>
                  <tr>
                    <td>Cloudiness</td>
                    <td>{weather.data.cloudiness}%</td>
                  </tr>
                  <tr>
                    <td>Wind</td>
                    <td>
                      {weather.data.wind.speed}mph to the{" "}
                      {weather.data.wind.direction} {weather.data.wind.arrow}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p>
                <small>
                  <i>
                    Weather data fetched at{" "}
                    {new Date(weather.data.fetchedAt).toLocaleTimeString()}
                  </i>
                </small>
              </p>
            </div>
          ) : weather?.error ? null : (
            <p>Set your location to retrieve weather info.</p>
          )}
        </section>

        <section title="Todo List">
          <h2>Todo</h2>

          <TodoList items={todo.items} />
        </section>
      </div>
    );
  };
}

import debounce from "lodash/debounce";
import { onRender, onMount } from "workframe";
import TodoList from "./todo-list";
import fetchWeatherData, { WeatherData } from "./weather-api";

export interface State {
  name: string;
  location: string;
  weather: WeatherData | null;
  fetchingWeather: boolean;
}

// XXX: Using any as the type here is a kludge
export default function App({ set, reset }: any) {
  onMount(async () => {
    console.log("mounted app");
    const name = localStorage.getItem("name");
    const location = localStorage.getItem("location");
    if (name) {
      set("name", name);
    }
    if (location) {
      set("location", location);
      set("fetchingWeather", true);
      const weatherData = await fetchWeatherData(location);
      set({
        weather: { ...weatherData },
        fetchingWeather: false,
      });
    }
  });

  onRender(() => {
    console.log("rendered app");
  });

  const clear = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("location");
    reset();
  };

  const setName = debounce((name: string) => {
    set("name", name);
    localStorage.setItem("name", name);
  }, 250);

  const setLocation = debounce(async (location: string) => {
    set("location", location);
    set("fetchingWeather", true);
    const weatherData = await fetchWeatherData(location);
    set({
      weather: { ...weatherData },
      fetchingWeather: false,
    });
    localStorage.setItem("location", location);
  }, 500);

  return (state: State) => {
    const { name, location, weather, fetchingWeather } = state;
    const now = new Date();

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
              onInput={(e: any) => setName(e.target.value)}
            />

            <input
              value={location}
              placeholder="Enter your location"
              autofocus="autofocus"
              onInput={(e: any) => setLocation(e.target.value)}
            />
            <small>
              <i>
                Examples: "Portland", "Portland, Oregon", "Portland, OR, US",
                "London, UK"
              </i>
            </small>

            <button type="button" onClick={clear} style="width: 320px">
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

          <TodoList items={[]} />
        </section>
      </div>
    );
  };
}

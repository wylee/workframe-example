// @ts-ignore
import { WORKFRAME_OPEN_WEATHER_API_KEY } from "env";

import capitalize from "lodash/capitalize";

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const WEATHER_API_KEY = WORKFRAME_OPEN_WEATHER_API_KEY;
const FIVE_MINUTES_IN_MS = 300000;

type CardinalDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

interface ApiData {
  name: string;
  message: string;
  coord: {
    lat: number;
    lon: number;
  };
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  clouds: {
    all: number;
  };
  weather: { main: string; description: string }[];
  wind: {
    speed: number;
    deg: number;
  };
}

export interface WeatherData {
  data: {
    location: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    temperature: number;
    low: number;
    high: number;
    humidity: number;
    cloudiness: number;
    descriptions: string[];
    wind: {
      speed: number;
      degrees: number;
      direction: CardinalDirection;
      arrow: string;
    };
    fetchedAt: number;
  } | null;
  error: string | null;
}

export default async function fetchWeatherData(
  location: string
): Promise<WeatherData> {
  location = location.trim();

  if (!location) {
    return { data: null, error: null };
  }

  const now = new Date();
  const nowTimestamp = now.getTime();
  const locationKey = location.replace(/\s+/, "").toLowerCase();
  const cacheKey = `weatherData:${locationKey}`;
  const cachedWeatherData = localStorage.getItem(cacheKey);

  if (cachedWeatherData) {
    const parsedWeatherData: WeatherData = JSON.parse(cachedWeatherData);
    const data = parsedWeatherData.data;
    if (data && nowTimestamp - data.fetchedAt < FIVE_MINUTES_IN_MS) {
      return parsedWeatherData;
    }
  }

  const url = `${WEATHER_API_URL}?q=${location}&units=imperial&appid=${WEATHER_API_KEY}`;

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    return { data: null, error: "Could not fetch weather data" };
  }

  const data: ApiData = await response.json();

  console.log(data);

  if (response.status >= 400) {
    return { data: null, error: capitalize(data.message) };
  }

  const [windDirection, windArrow] = getWindDirectionAndArrow(data.wind.deg);

  const weatherData = {
    data: {
      location: data.name,
      coordinates: {
        latitude: data.coord.lat,
        longitude: data.coord.lon,
      },
      temperature: data.main.temp,
      low: data.main.temp_min,
      high: data.main.temp_max,
      humidity: data.main.humidity,
      cloudiness: data.clouds.all,
      descriptions: data.weather.map(
        ({ main, description }) => `${main} - ${description}`
      ),
      wind: {
        speed: data.wind.speed,
        degrees: data.wind.deg,
        direction: windDirection,
        arrow: windArrow,
      },
      fetchedAt: nowTimestamp,
    },
    error: null,
  };

  console.log(weatherData);

  localStorage.setItem(cacheKey, JSON.stringify(weatherData));

  return weatherData;
}

/** Convert wind direction to arrow
 *
 * This will produce an arrow corresponding to the wind direction. The
 * arrow will be pointing toward where the wind is blowing (so 180° from
 * the specified direction).
 *
 * @param degrees Direction wind is coming *from*
 */
function getWindDirectionAndArrow(degrees): [CardinalDirection, string] {
  degrees = (degrees + 180) % 360;
  if (degrees < 15) {
    return ["N", "⬆️"];
  } else if (degrees < 60) {
    return ["NE", "↗️"];
  } else if (degrees < 105) {
    return ["E", "➡️"];
  } else if (degrees < 150) {
    return ["SE", "↘️"];
  } else if (degrees < 195) {
    return ["S", "⬇️"];
  } else if (degrees < 240) {
    return ["SW", "↙️"];
  } else if (degrees < 285) {
    return ["W", "⬅️"];
  } else if (degrees < 330) {
    return ["NW", "↖️"];
  }
  return ["N", "⬆️"];
}

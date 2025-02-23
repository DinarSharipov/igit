import { getCurrentLocation } from "./functions";
import { GetWeatherRequestBody, IGetWeatherResponse } from "./types";




export async function fetchWeather({ end_date, start_date }: GetWeatherRequestBody) {
  try {
    const locationsQuery = await getCurrentLocation() as { longitude: number, latitude: number };
    const params = new URLSearchParams({
      start_date,
      end_date,
      latitude: locationsQuery.latitude?.toFixed(2) ?? '',
      longitude: locationsQuery.longitude?.toFixed(2) ?? '',
    });
    const query = `https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,relative_humidity_2m&${params}`
    const response = await fetch(query);
    const data = await response.json() as IGetWeatherResponse;
    return data
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}
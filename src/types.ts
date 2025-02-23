export interface User {
  name?: string;
  password?: string;
}

export interface IGetWeatherResponse {
  hourly: {
    relative_humidity_2m: number[],
    temperature_2m: number[],
    time: string[],
  }
}

export interface GetWeatherRequestBody {
  start_date: string,
  end_date: string,
}


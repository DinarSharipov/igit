/** Сущность пользователя */
export interface User {
  name?: string;
  password?: string;
}

/** Основные поля тела ответа сервиса получения данных о погоде */
export interface IGetWeatherResponse {
  hourly: {
    relative_humidity_2m: number[],
    temperature_2m: number[],
    time: string[],
  }
}

/** Тело запроса для получения данных о погоде */
export interface GetWeatherRequestBody {
  start_date: string,
  end_date: string,
}


/** Данные для графиков */
export interface WeatherData {
  time: string;
  temperature: number;
  humidity: number;
}

/** Вид графика */
export type ChartMode = 'average' | 'line' | 'bar'


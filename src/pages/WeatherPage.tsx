
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "../components/Button";
import { ChangeThemeButton } from "../components/ChangeThemeButton";
import { Input } from "../components/Input";
import { Spinner } from "../components/Spinner";
import { logoutHandler } from "../functions";
import { fetchWeather } from "../service";
import { GetWeatherRequestBody } from "../types";

/** Данные для графиков */
interface WeatherData {
  time: string;
  temperature: number;
  humidity: number;
}

/** Вид графика */
type Mode = 'average' | 'line' | 'bar'

/** Страница с графиками */
export const WeatherPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<Mode>('line');
  const [range, setRange] = useState<GetWeatherRequestBody>({
    start_date: '2025-01-01',
    end_date: '2025-01-30',
  });

  /** Изменить даты */
  const setRangeHandler = (key: keyof GetWeatherRequestBody, value: string) => {
    const prepared = {
      ...range,
      [key]: value
    }

    if (prepared.end_date && prepared.start_date > prepared.end_date) {
      prepared['end_date'] = prepared.start_date
    }

    if (prepared.start_date && prepared.end_date < prepared.start_date) {
      prepared['start_date'] = prepared.end_date
    }
    setRange(prepared)
  }

  /** Получить данные */
  const fetchWeatherHandler = async () => {
    setIsLoading(true)
    const data = await fetchWeather(range);
    if (data?.hourly) {
      const prepared: WeatherData[] = data?.hourly?.time?.map((t, i) => ({
        time: new Intl.DateTimeFormat('ru-RU').format(new Date(t)),
        humidity: data.hourly.relative_humidity_2m[i],
        temperature: data.hourly.temperature_2m[i]
      }))
      setData(prepared)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchWeatherHandler();
  }, [range]);

  /** Средняя скользящая */
  const calculateMovingAverage = (data: WeatherData[], windowSize: number): WeatherData[] => {
    return data.map((_, index, array) => {
      if (index < windowSize - 1) return { ...array[index], temperature: NaN };
      const avgTemp = array.slice(index - windowSize + 1, index + 1).reduce((sum, item) => sum + item.temperature, 0) / windowSize;
      return { ...array[index], temperature: avgTemp };
    });
  };

  const movingAverageData = calculateMovingAverage(data, 14);

  /** Выбор вида графика */
  const selectedChart: Record<Mode, ReactNode> = useMemo(() => ({
    average: <LineChart width={1000} height={600} data={data}>
      <XAxis dataKey="time" />
      <YAxis label={{ value: "Температура (°C)", angle: -90, position: "insideLeft" }} />
      <Tooltip />
      <CartesianGrid stroke="#ccc" />
      <Line type="monotone" dataKey="temperature" name="Температура (°C)" stroke="#8884d8" />
      <Line type="monotone" dataKey="temperature" data={movingAverageData} name="Скользящая средняя (°C)" stroke="#ff7300" />
    </LineChart>,
    bar: <BarChart width={1000} height={600} data={data}>
      <XAxis dataKey="time" />
      <YAxis label={{ value: "Температура (°C)", angle: -90, position: "insideLeft" }} />
      <Tooltip />
      <CartesianGrid stroke="#ccc" />
      <Bar dataKey="temperature" fill="#8884d8" name="Температура (°C)" />
      <Bar dataKey="humidity" fill="#82ca9d" name="Влажность (%)" />
    </BarChart>,
    line: <LineChart width={1000} height={600} data={data}>
      <XAxis dataKey="time" />
      <YAxis yAxisId="left" orientation="left" />
      <YAxis yAxisId="right" orientation="right" />
      <CartesianGrid stroke="#ccc" />
      <Tooltip formatter={(value, name) => [value, name === "temperature" ? "Температура (°C)" : "Влажность (%)"]} />
      <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#8884d8" />
      <Line yAxisId="right" type="monotone" dataKey="humidity" stroke="#82ca9d" />
    </LineChart>
  }), [mode, data])

  return (
    <div className="flex flex-col gap-4 p-4 h-[100%]">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Статистика погоды</h2>
        <div className="flex gap-2">
          <ChangeThemeButton />
          <Button onClick={() => {
            logoutHandler();
            navigate('/login')
          }}>Выйти</Button>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold mr-2">Вид:</h2>
          <Button isActive={mode === 'line'} onClick={() => setMode('line')}>Линейный график</Button>
          <Button isActive={mode === 'bar'} onClick={() => setMode('bar')}>Гистограмма</Button>
          <Button isActive={mode === 'average'} onClick={() => setMode('average')}>Линейный график со скользящей средней</Button>
        </div>
        <div className="text-lg font-bold">Выберите диапазон дат</div>
        <div className="flex gap-4">
          <Input onChange={(e) => setRangeHandler('start_date', e)} type="date" value={range.start_date} />
          <Input onChange={(e) => setRangeHandler('end_date', e)} type="date" value={range.end_date} />
        </div>
      </div>
      <div className="flex justify-center h-[100%]">
        {isLoading ? <div className="flex items-center justify-center"><Spinner /></div> : selectedChart[mode]}
      </div>
    </div>
  );
};
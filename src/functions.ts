import { User, WeatherData } from "./types"

export const getDataBaseUsers = (): User[] => {
  const storage = localStorage.getItem('users')
  return storage ? JSON.parse(storage) as User[] : []
}

/** Хэндлер удаления токена */
export const logoutHandler = () => {
  localStorage.removeItem('token')
}

/** Получение координат */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      return reject(new Error("Геолокация не поддерживается вашим браузером"));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(new Error(`Ошибка геолокации: ${error.message}`))
    );
  });
};

/** Средняя скользящая */
export function calculateMovingAverage(data: WeatherData[], windowSize: number): WeatherData[] {
  return data.map((_, index, array) => {
    if (index < windowSize - 1) return { ...array[index], temperature: NaN };
    const avgTemp = array.slice(index - windowSize + 1, index + 1).reduce((sum, item) => sum + item.temperature, 0) / windowSize;
    return { ...array[index], temperature: avgTemp };
  });
};
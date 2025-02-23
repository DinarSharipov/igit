import { User } from "./types"

export const getDataBaseUsers = (): User[] => {
  const storage = localStorage.getItem('users')
  return storage ? JSON.parse(storage) as User[] : []
}

export const logoutHandler = () => {
  localStorage.removeItem('token')
}

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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { getDataBaseUsers } from "../functions";
import { User } from "../types";

type Mode = 'login' | 'registration'

export const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>('login')
  const [user, setUser] = useState<User>();
  const [success, setSuccess] = useState<string>();
  const [error, setError] = useState<string>();

  const navigate = useNavigate();

  /** Изменение логин/регистрация */
  const setModeHandler = (mode: Mode) => {
    setError(undefined);
    setUser(undefined);
    setMode(mode)
  }

  /** Проверить заполненность полей */
  const checkError = () => {
    if (!user?.name) {
      return 'Введите Имя пользователя'
    }
    if (!user?.password) {
      return 'Введите Пароль'
    }
    if ((user.password?.length < 4) && mode === 'registration') {
      return "Пароль должен состоять минимум из 4 символов"
    }
    return false
  }

  /** Вход */
  const handleLogin = () => {
    const error = checkError();
    if (error) {
      setError(error)
    } else {
      const existUsers = getDataBaseUsers();
      const currentUser = existUsers?.find(e => e.name === user?.name)
      if (currentUser) {
        if (currentUser.password === user?.password) {
          localStorage.setItem('token', '123123');
          navigate('/weather')
        } else {
          setError('Неверный пароль')
        }
      } else {
        setError('Пользователь с такими именем не найден')
      }
    }
  };

  /** Регистрация */
  const handleRegistration = () => {
    const error = checkError();
    if (error) {
      setError(error)
    } else {
      if (getDataBaseUsers()?.find(e => e.name === user?.name)) {
        setError('Пользователь с таким именем уже существует')
      } else {
        localStorage.setItem('users', JSON.stringify([...getDataBaseUsers(), user] as User[]));
        setSuccess('Пользователь успешно зарегистрирован!');
        setTimeout(() => setSuccess(undefined), 2000)
        setModeHandler('login')
      }
    }
  }

  return (
    <div className="w-full flex flex-col items-center h-[100%] justify-center">
      <div className="py-4 px-8 border-1 border-slate-400 rounded-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="text-4xl mb-4">Авторизация</div>
          <div className="flex gap-4">
            <Button isActive={mode === 'login'} onClick={() => setModeHandler('login')}>Вход</Button>
            <Button isActive={mode === 'registration'} onClick={() => setModeHandler('registration')}>Регистрация</Button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold underline">{mode === 'login' ? 'Вход' : 'Регистрация'}</h2>
          <div className="flex gap-4">
            <Input type="text" placeholder="Имя пользователя" value={user?.name ?? ''} onChange={(e) => setUser({ ...user, name: e })} />
            <Input type="password" placeholder="Пароль" value={user?.password ?? ''} onChange={(e) => setUser({ ...user, password: e })} />
          </div>
          <Button onClick={mode === 'login' ? handleLogin : handleRegistration}>
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </Button>
          {success && <p className="text-green-400">{success}</p>}
          {error && <p className="text-red-600 font-bold">{error}</p>}
        </div>
      </div>
    </div >
  );
};
import React, {FC, useState} from "react";
import {useNavigate} from "react-router-dom";
import bcrypt from 'bcryptjs';
import './registration.css'
import axios from "axios";


interface ErrorUserData{
    email?:string,
    login?:string,
    password?:string
}
export interface User{
    email: string,
    username: string,
    password: string
}

const Registration: FC = () => {
    const errDefault:ErrorUserData = {}
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState(errDefault);

    const navigate = useNavigate();

    const validateForm = ()=>{
        const newErrors:ErrorUserData = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            newErrors.email = 'Email обязателен';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Введите корректный Email';
        }

        if (!login) {
            newErrors.login = 'Логин обязателен';
        } else if (login.length < 4 || login.length > 8) {
            newErrors.login = 'Логин должен содержать не менее 4 и не более 8 символов';
        }

        if (!password) {
            newErrors.password = 'Пароль обязателен';
        } else if (password.length < 4 || password.length > 12) {
            newErrors.password = 'Пароль должен содержать не менее 4 и не более 12 символов';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Если ошибок нет, возвращаем true
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Предотвращаем перезагрузку страницы
        if (validateForm()) {
            // const hashedPassword = await bcrypt.hash(password, 10);
            const user: User = {email, username: login, password}

            // Здесь можно отправить данные на сервер
            const response = await axios.post('http://localhost:8080/auth/sign-up', user);
            console.log("RESPONSE REGISTRATION: \n", response);

            // console.log('Форма отправлена', { email, username: login, password })
            // console.log('Форма отправлена', { email, username: login, password: hashedPassword });
            navigate(`/user/${login}`, {replace: false});
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <div className="bg-gray-200 justify-items-center min-h-screen p-4">
                <div id={'white-box'} className="flex flex-col bg-white p-8 aspect-square h-96 shadow-md">
                    <h1 className={'text-2xl'}>Регистрация</h1>
                    <div className="">
                        <div className="flex flex-row space-x-5">
                            <p>E-mail</p>
                            <input id="email_input"
                                   type="email"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                                   className="border-2 border-black"/>
                            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                        </div>
                    </div>
                    <div className="py-5 ">
                        <div className="flex flex-row space-x-5">
                            <p>Логин</p>
                            <input id="login_input"
                                   type="text"
                                   value={login}
                                   onChange={(e) => setLogin(e.target.value.trim())}
                                   className="border-2 border-black"/>
                            {errors.login && <p style={{ color: 'red' }}>{errors.login}</p>}
                        </div>
                    </div>
                    <div className="flex flex-row space-x-2.5">
                        <p>Пароль</p>
                        <input id="password_input"
                               type="password"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               className="border-2 border-black"/>
                        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    </div>
                    <div className="px-28 py-5">
                        <button id="registration_btn"
                                type="submit"
                                className="bg-gray-300 py-2">Регистрация
                        </button>
                    </div>

                </div>
            </div>
        </form>

    );
}
export default Registration;
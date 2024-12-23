import {FC, useEffect} from "react";
import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import './user.css'
import {instance} from "../../api.config.ts";
import {handleClickHelp} from "../start-page/start-page.tsx";


const UserPage: FC = () =>{

    const navigate = useNavigate();
    const {login: login } = useParams(); // Извлечение данных из состояния
    const handleClick = () => {
        window.localStorage.removeItem("token");
        navigate('/');
    }
    return(
        <div className="bg-gray-200 justify-items-center min-h-screen p-4">
            <div className="bg-white p-8 aspect-square shadow-md">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <h1 className="text-2xl">Добро пожаловать, {login}!</h1>
                    <button onClick={() => navigate(`/user/${login}/exercises`, {state: {username: login}, replace: false})}
                            className="bg-gray-300 px-4 py-2">
                        Упражнения
                    </button>
                    <button onClick={() => navigate(`/user/${login}/statistic`, {state: {username: login}, replace: false})}
                            className="bg-gray-300 px-6 py-2">
                        Статистика
                    </button>
                    <button className="bg-gray-300 px-6 py-2" onClick={handleClick}>Выход</button>
                    <button onClick={handleClickHelp} className="bg-gray-300 px-8 py-2">Справка</button>
                </div>
                <Outlet/>
            </div>
        </div>
    );
}

export default UserPage;

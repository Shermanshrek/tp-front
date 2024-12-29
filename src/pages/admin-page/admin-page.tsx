import {FC} from "react";
import './admin.css'
import {useNavigate} from "react-router-dom";
// import {handleClickHelp} from "../start-page/start-page.tsx";

const admin: FC = () =>{
    const navigate = useNavigate();
    const handleClick = () => {
        window.localStorage.removeItem("token");
        navigate('/');
    }
    const handleClickHelpAdmin = () => {
        try {
            window.open("/src/Справка/helpAdmin.html", "_blank");
        }catch (err){
            console.error('Ошибка при открытии страницы справки:', err);
        }
    }
    return(
        <div className="bg-gray-200 justify-items-center min-h-screen p-4">
            <div className="bg-white p-8 aspect-square shadow-md">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <h1 className="text-2xl">Панель администратора</h1>
                    <button onClick={() => navigate('/admin/exercises', {replace: false})}
                            className="bg-gray-300 px-4 py-2 correct-size">Упражнения
                    </button>
                    <button onClick={() => navigate('/admin/create-difficult', {replace: false})}
                            className="bg-gray-300 px-4 py-2 ">
                        Создать уровень <br/> сложности
                    </button>
                    <button onClick={() => navigate('/admin/create-exercise', {replace: false})}
                            className="bg-gray-300 px-4 py-2">Создать <br/> упражнение
                    </button>

                    <button onClick={() => navigate('/admin/users', {replace: false})}
                            className="bg-gray-300 px-4 py-2">Учётные записи
                    </button>

                    <button onClick={() => navigate('/admin/statistic', {replace: false})}
                            className="bg-gray-300 px-4 py-2">Статистика
                    </button>
                    <button className="bg-gray-300 px-6 py-2" onClick={handleClick}>Выход</button>
                    <button onClick={handleClickHelpAdmin} className="bg-gray-300 px-4 py-2">Справка</button>
                </div>
            </div>
        </div>
    );
}

export default admin;
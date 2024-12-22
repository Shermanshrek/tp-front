import {FC} from "react";
import './admin.css'
import {useNavigate} from "react-router-dom";
import {handleClickHelp} from "../start-page/start-page.tsx";

const admin: FC = () =>{
    // * TODO ПРОВЕРКА НА АДМИНА
    const navigate = useNavigate();
    return(
        <div className="bg-gray-200 justify-items-center min-h-screen p-4">
            <div className="bg-white p-8 aspect-square shadow-md">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <h1 className="text-2xl">Admin page</h1>
                    <button onClick={() => navigate('/admin/exercises', {replace: false})}
                            className="bg-gray-300 px-4 py-2 correct-size">Упражнения</button>
                    <button onClick={() => navigate('/admin/create-difficult', {replace: false})}
                            className="bg-gray-300 px-4 py-2 ">
                                Создать уровень <br/> сложности
                    </button>
                    <button onClick={() => navigate('/admin/create-exercise', {replace:false})}
                            className="bg-gray-300 px-4 py-2" >Создать <br/> упражнение</button>

                    <button onClick={() => navigate('/admin/users', {replace:false})}
                            className="bg-gray-300 px-4 py-2">Учётные записи</button>

                    <button onClick={() => navigate('/admin/statistic', {replace:false})}
                            className="bg-gray-300 px-4 py-2">Статистика</button>

                    <button onClick={handleClickHelp} className="bg-gray-300 px-4 py-2">Справка</button>
                </div>
            </div>
        </div>
    );
}

export default admin;
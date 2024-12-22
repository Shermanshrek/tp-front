// import '../../../styles.css'

import {FC} from "react";
import {useNavigate} from "react-router-dom";
import './start.css'


export function handleClickHelp(){
    try {
        // window.location.href="src/Справка/help.html"
        window.open("/src/Справка/help.html", "_blank")
    }catch (err){
        console.error('Ошибка при открытии страницы справки:', err);
    }
}

const StartPage: FC = () => {

    const navigate = useNavigate();

    return (
        <div className="grid bg-gray-200 justify-items-center h-screen w-full p-4">
            <div className="bg-white p-8 aspect-square shadow-md h-w">
                <div className="flex items-center justify-center space-x-5">
                    <button onClick={() => navigate('/about', {replace: false})}
                            className="bg-gray-300 px-4 py-2">
                        О разработчиках
                    </button>
                    <button onClick={handleClickHelp}
                            className="bg-gray-300 px-4 py-2">Справка
                    </button>
                </div>
                <div className="flex flex-col items-center justify-center p-4 space-y-2">
                    <div>
                        <button onClick={() => navigate('/sign-in', {replace: false})}
                                className="bg-gray-300 px-4 py-2">
                            Войти
                        </button>
                    </div>
                    <div>
                        <button onClick={() => navigate('/registration', {replace: false})}
                                className="bg-gray-300 px-4 py-2">
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}


export default StartPage;

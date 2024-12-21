// import '../../../styles.css'

import {FC} from "react";
import {useNavigate} from "react-router-dom";
import './start.css'

interface StartPageProps {
    isLoggedIn?: boolean
}

const StartPage: FC = (props: StartPageProps) => {

    const navigate = useNavigate();
    console.log(props.isLoggedIn);
    if (props.isLoggedIn) {
        navigate('/registration', {replace: false});
    }
    else {
        return (
                <div className="grid bg-gray-200 justify-items-center h-screen w-full p-4">
                    <div className="bg-white p-8 aspect-square shadow-md h-w">
                        <div className="flex items-center justify-center space-x-5">
                            <button onClick={() => navigate('/about', {replace: false})}
                                    className="bg-gray-300 px-4 py-2">
                                О разработчиках
                            </button>
                            <button className="bg-gray-300 px-4 py-2">Справка</button>
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
}


export default StartPage;

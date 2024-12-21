import {FC} from "react";
import {useNavigate} from "react-router-dom";

const About:FC = () => {
    const navigate = useNavigate();
    return(
        <>
            <header>
                <title>О разработчиках</title>
            </header>
            <div className="bg-gray-200 min-h-screen p-4">
                <div className="bg-white p-8 aspect-square shadow-md">
                    <div className="text-2xl">
                        <p>Лабораторный практикум по дисциплине "Технологии программирования"</p>
                        <p>Тема: "Клавиатурный тренажёр с функциями администрирования"</p>
                        <p><br/></p>
                        <p>
                            Разработчики:<br/>
                            Обучающиеся группы 6402-090301D<br/>
                            Геворгян Давид<br/>
                            Носа Сергей<br/>
                            Сидоров Валентин<br/>
                            <br/>
                            Руководитель:<br/>
                            Зеленко Лариса Сергеевна<br/>
                            <br/>
                            Самарский университет 2024
                        </p>
                        <div className="px-52">
                            <button onClick={() => navigate(-1)}
                                    className="bg-gray-300 space-y-4 px-4 py-2 mt-5">Ок
                            </button>
                        </div>


                    </div>

                </div>
            </div>


        </>
    );
}

export default About;
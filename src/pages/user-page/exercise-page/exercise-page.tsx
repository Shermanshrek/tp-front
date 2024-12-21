import {FC, useEffect, useState} from "react";
import './exercises.css'
import {useLocation, useNavigate, useParams} from "react-router-dom";
import axios from 'axios'
import * as http from "node:http";
import { ResponseDifficulty } from "../../admin-page/create-exercise-page/create-exercise-page";

interface Exercise{
    id: number,
    name: string,
    difficulty_level: string
}

export interface ResponseExercise{
    id: number,
    doTime: number,
    exerciseName: string,
    difficultyLevel: ResponseDifficulty,
    difficultyLevelName?: ResponseDifficulty,
    exerciseText: string,
    errors: number
}
interface Difficult{
    name: string
}

const exercisePage: FC = () => {
    const navigate = useNavigate();
    const {login: login} = useParams(); // Извлечение данных из состояния
    console.log(useParams())
    console.log("Exercises login: ",login);



    // * Состояние для выбранной сложности
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
    const [exercises, setExercises] = useState<ResponseExercise[]>([]);
    const [dif, setDif] = useState<ResponseDifficulty[]>([]);
    const [error, setError] = useState<string | null>(null); // Для хранения ошибок

    useEffect(() => {
        const fetchAll = async () => {
            try{
                const responseExercises = await axios.get<ResponseExercise[]>("http://localhost:8080/user/get-exercises");
                const responseDifficult = await axios.get<ResponseDifficulty[]>("http://localhost:8080/user/get-difficulty-levels");
                console.log("RESPONSE EXER\n",responseExercises.data)
                console.log("RESPONSE DIF\n",responseDifficult.data)
                setExercises(responseExercises.data)
                setDif(responseDifficult.data);
            }catch(err){
                console.log("ERROR! \n", err)
            }
        }
        fetchAll();
    },[])
    console.log("Exercises\n", exercises);
    console.log("DIFFICULT\n", dif);


    // * Фильтрация упражнений в зависимости от выбранной сложности
    const filteredExercises = selectedDifficulty ? exercises.filter(ex =>
            ex.difficultyLevelName?.name === selectedDifficulty) : exercises;

    
    const fetchData = async (id: number) => {
        try {
            const response = await axios.get<ResponseExercise>(`http://localhost:8080/user/do-exercise/${id}`);
            const ex: ResponseExercise = {
                id: response.data.id, 
                doTime: response.data.doTime,
                difficultyLevel: response.data.difficultyLevel,
                exerciseName: response.data.exerciseName,
                exerciseText: response.data.exerciseText,
                errors: response.data.errors
            }
            setError(null); // Сбрасываем ошибку
            console.log("AXIOS: ", response.data);
            console.log("EX: \n", ex);
            navigate(`/user/${login}/exercises/${id}`, {state:{ex}, replace: false})
        }catch (err){
            setError('Ошибка при получении данных.'); // Устанавливаем сообщение об ошибке
            //setResponseEx(null); // Сбрасываем данные
            console.log(err);
        }
    }
    const listExercises = filteredExercises.map( (ex) =>
        <li key={ex.id} className={'mb-5'}>
            <button className={'button-text'}
                    onClick={() => {
                            fetchData(ex.id);
                        }
                    }>
                {ex.exerciseName}</button>
        </li>)
    const difficultList = dif.map(d => <option key={d.name} value={d.name}>{d.name}</option>);    

    // * Обработчик изменения выбора сложности
    const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDifficulty(event.target.value);
    };

    return(
        <div className={'flex flex-col bg-gray-200 items-center justify-items-center min-h-screen p-4'}>
            <div className="flex flex-col bg-white p-8 aspect-square shadow-md relative">
                <h1 className={'h1 text-2xl'}>Выбор упражнения</h1>
                <div className={'flex flex-row'}>
                    <label htmlFor={'select_difficult'} className={'text-xl mr-5 mt-1'}>
                        Сложность:
                    </label>
                    <select id={'select_difficult'}
                            value={selectedDifficulty}
                            onChange={handleDifficultyChange} // Обработчик изменения
                            className={'border-2 border-black sel'}>
                        <option value={''}></option>
                        {difficultList}
                    </select>
                </div>

                <ul className={'mt-5 text-xl list-items mb-5'}>
                    {listExercises}
                </ul>

                <button onClick={() => navigate(-1)}
                        className={'bg-gray-300 py-2 absolute bottom-4 right-4'}>Назад</button>
            </div>
        </div>
    );

}
export default exercisePage;
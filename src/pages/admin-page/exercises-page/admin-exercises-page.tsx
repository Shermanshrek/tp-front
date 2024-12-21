import {FC, useState, useEffect} from "react";
import './admin-exercises.css'
import {useLocation, useNavigate} from "react-router-dom";
import { ResponseExercise } from "../../user-page/exercise-page/exercise-page";
import { ResponseDifficulty } from "../create-exercise-page/create-exercise-page.tsx";
import axios from 'axios'

interface Exercise{
    id: number,
    name: string,
    difficult: string
}
const adminExercisesPage: FC = () => {
    const navigate = useNavigate();

    // * Состояние для выбранной сложности
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
    const [exercises, setExercises] = useState<ResponseExercise[]>([]);
    const [dif, setDif] = useState<ResponseDifficulty[]>([]);

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

    const fetchData = async (id: number) => {
        try {
            // const response = await axios.get<ResponseExercise>(`http://localhost:8080/do-exercise/${id}`);
            const response = await axios.post(`http://localhost:8080/admin/do-exercise/${id}`, { headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }})
            const ex: ResponseExercise = {
                id: response.data.id, 
                doTime: response.data.doTime,
                difficultyLevel: response.data.difficultyLevel,
                exerciseName: response.data.exerciseName,
                exerciseText: response.data.exerciseText,
                errors: response.data.errors
            }
            // setError(null); // Сбрасываем ошибку
            console.log("AXIOS: ", response.data);
            console.log("EX: \n", ex);
            navigate(`/admin/exercises/${id}`, {state:{ex}, replace: false})
        }catch (err){
            // setError('Ошибка при получении данных.'); // Устанавливаем сообщение об ошибке
            // setResponseEx(null); // Сбрасываем данные
            console.log(err);
        }
    }




    // * Фильтрация упражнений в зависимости от выбранной сложности
    const filteredExercises = selectedDifficulty ? exercises.filter(ex =>
            ex.difficultyLevelName?.name === selectedDifficulty) : exercises;

    const listExercises = filteredExercises.map( (ex) =>
        <li key={ex.id} className={'mb-5'}>
            <div className={'flex flex-row space-x-10'}>
                <button className={'button-text'} onClick={() => fetchData(ex.id)}>{ex.exerciseName}</button>
                <button className={'bg-gray-300 py-2 buttn'} onClick={() => deleteExercise(ex.id)}>Удалить</button>
            </div>
        </li>)
    const deleteExercise = async (id: number) => {
        try {
            // const response = await axios.delete(`http://localhost:8080/admin/exercises/${id}`);
            const response = await axios.delete(`http://localhost:8080/admin/exercises/${id}`, { headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }})
            console.log(response.data);

            // Обновляем состояние, убирая удаленное упражнение
            setExercises((prevExercises) => prevExercises.filter(exercise => exercise.id !== id));
        } catch (err) {
            console.log("DELETE ERROR!\n", err);
        }
    };



    // * Обработчик изменения выбора сложности
    const handleDifficultyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDifficulty(event.target.value);
    };
    const difficultList = dif.map(d => <option key={d.name} value={d.name}>{d.name}</option>);    
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
                        {/* * TODO цеплять уровни сложности с сервера и выводить их сюда */}
                        <option value={''}></option>
                        {difficultList}
                    </select>
                </div>

                <ul className={'mt-5 text-xl list-items mb-5'}>
                    {listExercises}
                </ul>

                <button onClick={() => navigate(-1)}
                        className={'bg-gray-300 py-2 absolute bottom-4 right-4 buttn'}>Назад</button>
            </div>
        </div>
    );

}
export default adminExercisesPage;

// async function deleteExercise(id: number): void {
//     try{
//         const response = await axios.delete(`http://localhost:8080/admin/exercises/${id}`);
//         console.log(response.data);
//     }catch(err){
//         console.log("DELETE ERROR!\n", err);
//     }
    
// }

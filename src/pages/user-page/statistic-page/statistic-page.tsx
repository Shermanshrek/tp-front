import {ChangeEvent, FC, useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import './statistic.css'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import {Line} from "react-chartjs-2";
import {ResponseExercise} from "../exercise-page/exercise-page.tsx";
import axios from "axios";
import {ResponseStat} from "./response-stat.ts";
// Регистрация компонентов Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


const statistic:FC = () =>{
    const navigate = useNavigate();
    const {login: login } = useParams(); // Извлечение данных из состояния
    const [exercises, setExercises] = useState<ResponseExercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [stat, setStat] = useState<ResponseStat[]>([]);
    useEffect(() => {
        const fetchAll = async () => {
            try{
                const responseExercises = await axios.get<ResponseExercise[]>("http://localhost:8080/user/get-exercises");
                console.log("RESPONSE EXER\n",responseExercises.data)
                setExercises(responseExercises.data)
            }catch(err){
                console.log("ERROR! \n", err)
            }
        }
        fetchAll();
    },[])
    const exercisesList = exercises.map((ex) => {
        return <option key={ex.id} value={ex.exerciseName}>{ex.exerciseName}</option>
    })

    // Данные для графика
    const data = {
        // * TODO хватать данные с сервера
        labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'], // Метки по оси X
        datasets: [
            {
                label: 'Средняя скорость', // Название графика
                data: [12, 19, 3, 5, 2, 3], // Данные по оси Y
                fill: false,
                backgroundColor: 'white',
                borderColor: 'black',
            },
        ],
    };

    // Опции для графика
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: "Средняя скорость набора упражнения по дням"
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Дни"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Средняя скорость"
                },
            }
        }
    };
    const handleChangeSelect = async (event:  ChangeEvent<HTMLSelectElement>, exercises: ResponseExercise[]) => {
        setSelectedExercise(event.target.value)
        // console.log("selected exercise: \n", selectedExercise)
        let exId: number | undefined = undefined;
        for (const ex of exercises) {
            if(ex.exerciseName === event.target.value){
                exId = ex.id;
            }
        }
        if(exId !== undefined){
            try{
                const response = await axios.get<ResponseStat[]>(`http://localhost:8080/user/get-exercise-stat/${login}/${exId}`);
                console.log(response.data);
                setStat(response.data);
            }catch (err){
                console.log(err);
            }
        }

    }
    const meanStat = (stats: ResponseStat[]): [string, string, string] => {
        let meanErrors = 0;
        let meanMeanSpeed = 0;
        let meanDoTime = 0;
        const len = stats.length
        for (let i = 0; i < len; i++) {
            meanErrors += stats[i].errorCount
            meanMeanSpeed += stats[i].meanTime;
            meanDoTime += stats[i].durationInSeconds
        }

        return [(meanErrors/len).toFixed(2), (meanMeanSpeed/len).toFixed(2), (meanDoTime/len).toFixed(2)];

    }
    const meanStats = meanStat(stat);
    return(
        <div className={'flex flex-col bg-gray-200 items-center justify-items-center min-h-screen p-4'}>
            <div className="flex flex-col bg-white p-8 aspect-square shadow-md relative">
                <h1 className={'text-2xl'}>Статистика</h1>
                <div className={'flex flex-row ml-5'}>
                    <label htmlFor={'select_exercise'} className={'text-xl mr-5 mt-1'}>
                        Упражнение:
                    </label>
                    <select id={'select_exercise'}
                            value={selectedExercise}

                            onChange={(e) => handleChangeSelect(e, exercises)}
                            className={'border-2 border-black sel'}>
                        <option value={''}></option>
                        {exercisesList}
                    </select>
                </div>
                <div className={'flex flex-col ml-5'}>
                    <div className={'flex flex-row space-x-5 text-xl mt-5'}>
                        <p>Среднее количество ошибок: {meanStats[0]}</p>
                        <p>Средняя скорость: {meanStats[1]}</p>
                    </div>
                    <div className={'flex flex-row space-x-5 text-xl mt-5'}>
                        <p>Среднее время выполнения: {meanStats[2]}</p>
                    </div>
                    <p className={'space-x-5 text-xl mt-5'}>Последнее выполнение {stat[stat.length - 1]?.exerciseDate}</p>
                </div>
                <h1 className={' mt-10 text-2xl'}>Средняя скорость набора упражнения по дням</h1>
                {/*Здесь должен быть график*/}
                <div className={'mb-16 items-center justify-items-center '}>
                    <Line data={data} options={options}/>
                </div>

                <button onClick={() => navigate(-1)}
                        className={'bg-gray-300 py-2 absolute bottom-4 right-4'}>
                    Назад
                </button>
            </div>

        </div>
    );
}

export default statistic;
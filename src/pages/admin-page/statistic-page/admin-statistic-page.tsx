import {ChangeEvent, FC, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
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
import {instance} from "../../../api.config.ts";
import {User} from "./User.ts";
import {ResponseExercise} from "../../user-page/exercise-page/exercise-page.tsx";
import {ResponseStat} from "../../user-page/statistic-page/response-stat.ts";
import {format} from "date-fns";
import {ru} from "date-fns/locale";

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

    const location = useLocation();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([])
    const [exercises, setExercises] = useState<ResponseExercise[]>([])
    const [selectedUser, setSelectedUser] = useState<string>('')
    const [selectedExercise, setSelectedExercise] = useState<string>('');
    const [stats, setStats] = useState<ResponseStat[]>([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await instance.get<User[]>('/admin/get-all-users')
                console.log(response.data);
                setUsers(response.data);
            }catch (err){
                console.log(err);
            }
        }
        fetchUsers();
    }, []);

    // Данные для графика
    const [chartData, setChartData] = useState({
        labels: [] as string[],
        datasets: [
            {
                label: 'Средняя скорость',
                data: [] as number[],
                fill: false,
                backgroundColor: 'white',
                borderColor: 'black',
            },
        ],
    });

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
    const filteredUsersList = users.filter(u => u.role !== "ROLE_ADMIN");
    const allUsers = filteredUsersList.map((u, index) => <option key={index} value={u.username}>{u.username}</option>)

    const handleChangeExercises = async (e: ChangeEvent<HTMLSelectElement>) =>{
        setSelectedExercise(e.target.value);
        try {
            const exer = exercises.find(ex => ex.exerciseName === e.target.value);
            if(exer !== undefined){
                const response = await instance.get(`/admin/get-exercise-stat/${selectedUser}/${exer.id}`);
                setStats(response.data);
                console.log(response.data);
                fillChartData(response.data);
            }

        }catch (err){
            console.log(err);
        }
    }
    const handleChangeUser = async (e:ChangeEvent<HTMLSelectElement>) => {
        setSelectedUser(e.target.value)
        try {
            const response = await instance.get<ResponseExercise[]>(`admin/get-stat-user/${e.target.value}`)
            setExercises(response.data);
            console.log(response.data);
        }catch (err){
            console.log(err)
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

        return [(meanErrors / len).toFixed(2), (meanMeanSpeed / len).toFixed(2), (meanDoTime / len).toFixed(2)];
    }

    const getDate = (date: Date) => {
        return format(new Date(date), 'd MMMM yyyy, HH:mm', {locale: ru});
    }
    const fillChartData = (data: ResponseStat[]) => {
        // Обновляем данные для графика
        const labels = data.map(stat => getDate(stat.exerciseDate));
        const speedData = data.map(stat => stat.meanTime); // Предполагается, что meanTime — это средняя скорость
        setChartData({
            labels,
            datasets: [
                {
                    label: 'Средняя скорость',
                    data: speedData,
                    fill: false,
                    backgroundColor: 'white',
                    borderColor: 'black',
                },
            ],
        });
    }

    const meanStats = meanStat(stats);
    const exerList = exercises.map((ex, i) => <option key={i} value={ex.exerciseName}>{ex.exerciseName}</option>)

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
                            onChange={(e) => handleChangeExercises(e)}
                            className={'border-2 border-black sel'}>
                        <option value={''}></option>
                        {exerList}
                    </select>
                    <label htmlFor={'select_User'} className={'text-xl mr-5 mt-1 ml-10'}>
                        Пользователь:
                    </label>
                    <select id={'select_User'}
                            value={selectedUser}
                            onChange={(e) => handleChangeUser(e)}
                            className={'border-2 border-black sel'}>
                        <option value={''}></option>
                        {allUsers}
                    </select>
                </div>
                <div className={'flex flex-col ml-5'}>
                    <div className={'flex flex-row space-x-5 text-xl mt-5'}>
                        <p>Среднее количество ошибок: {isNaN(+meanStats[0]) ? '' : meanStats[0]}</p>
                    </div>
                    <div className={'flex flex-row space-x-5 text-xl mt-5'}>
                        <p>Средняя скорость: {isNaN(+meanStats[1]) ? '' : meanStats[1]}</p>
                        <p>Время выполнения: {isNaN(+meanStats[2]) ? '' : meanStats[2]}</p>
                    </div>
                    <p className={'space-x-5 text-xl mt-5'}>Последнее выполнение {
                        stats[stats.length - 1] === undefined ? '' : getDate(stats[stats.length - 1].exerciseDate)}</p>
                </div>
                <h1 className={' mt-10 text-2xl'}>Средняя скорость набора упражнения</h1>
                {/*Здесь должен быть график*/}
                <div className={'mb-16 items-center justify-items-center '}>
                    <Line data={chartData} options={options}/>
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
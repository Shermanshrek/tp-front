import {FC, useEffect, useState} from "react";
import './create-exercise.css'
import {NavigateFunction, useNavigate} from "react-router-dom";
import axios from "axios";

interface CreateExercise{
    exerciseName: string,
    difficultyLevelName: string,
    errors?: number,
    exerciseText?: string,
    autoLength?: number,
    isAuto: boolean
}
interface Zones{
    zone_number: number,
    symbols: string[]
}
export interface ResponseDifficulty{
    name: string,
    zones: Zones[],
    toggle_time: number,
    min_len: number,
    max_len: number,
    max_errors: number
}
const createExercise: FC = () =>{
    const [showAuto, setShowAuto] = useState(false);
    const [showManually, setShowManually] = useState(false);
    const [dif, setDif] = useState<ResponseDifficulty[]>([])
    const [selected, setSelected] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get<ResponseDifficulty[]>("http://localhost:8080/admin/get-difficulty-levels");
                console.log(response.data);
                setDif(response.data);
            }catch(err){
                console.log(err);
            }
        }
        fetchData();
    }, [])
    // console.log("RESPONSE DIF: \n", dif);
    const difficultList =  dif.map((d) => <option key={d.name} value={d.name}>{d.name}</option>);   
    console.log(difficultList);
    // * Обработчик для первой кнопки
    const handleAuto = () => {
        setShowAuto(true);
        setShowManually(false); // Скрываем второй контент
    };

    // * Обработчик для второй кнопки
    const handleManually = () => {
        setShowManually(true);
        setShowAuto(false); // Скрываем первый контент
    };
    return(
        <div className="bg-gray-200 justify-items-center min-h-screen p-4">
            <div className="bg-white p-8 aspect-square shadow-md">

                <div className='container items-center justify-items-center'>
                    <h1 className='items-center justify-center text-2xl mb-6'>Создание упражнения</h1>
                    <p className='mb-2'>Введите название упражнения</p>
                    <input id={'title_ex'} type={'text'} className={'border-2 border-black'}/>
                </div>
                <br/>
                <div className='container items-center justify-items-center'>
                    <p>Выбор уровня сложности</p>
                    <select id={'select_difficult'} 
                            value={selected ?? ''}
                            onChange={(e) => {
                                setSelected(e.target.value);
                            }}
                            className={'border-2 border-black sel '}>
                        <option value={''}></option>    
                        {difficultList}
                    </select>
                </div>
                <br/>
                <div className={'flex flex-row justify-center space-x-5 mb-2'}>
                    <button onClick={handleAuto} className="bg-gray-300 px-4 py-2">Автоматический</button>
                    <button onClick={handleManually} className="bg-gray-300 px-4 py-2">Вручную</button>
                </div>
                <div className={'container items-center justify-items-center'}>
                    {showAuto && <Auto />}
                    {showManually && <Manually />}
                    {
                        (showManually || showAuto) &&
                        <button onClick={() => save(navigate, showAuto, selected)}
                                className="bg-gray-300 px-4 py-2 mt-4">Сохранить</button>
                    }
                </div>
            </div>
        </div>);
}

async function  save(navigate: NavigateFunction, showAuto: boolean, selected: string){
    // const selectElement: HTMLSelectElement = document.getElementById('select_difficult');
    // const sel: string = selectElement.value;
    const titleExInput: HTMLInputElement = document.getElementById("title_ex");
    const titleEx:string = titleExInput.value;
    let exer: CreateExercise;

    if(showAuto){
        const lenInput: HTMLInputElement = document.getElementById('len_ex');
        const len: number = +lenInput.value;
        exer = {
            exerciseName: titleEx,
            difficultyLevelName: selected,
            autoLength: len,
            isAuto: true
        };
        console.log(exer);

        // * TODO Отправлять данные на сервер
    }
    else{
        const txtArea: HTMLTextAreaElement = document.getElementById("txt_ex");
        const txt: string = txtArea.value;
        exer = {
            exerciseName: titleEx,
            difficultyLevelName: selected,
            exerciseText: txt,
            isAuto: false
        }
    }
    console.log("POST EXERCISE: \n",exer);
    try{
        const response = await axios.post("http://localhost:8080/admin/create-exercise", exer);
        console.log("POST RESPONSE: ", response.data);
    }
    catch(err){
        console.log("POST ERROR! ", err);
    }
    

    navigate(-1);
}

// * Автоматический
const Auto:FC = () => {
    return(
        <div>
            <p className={'txt mb-2'}>Введите необходимую<br/> длину упражнения</p>
            <input id='len_ex' type={'number'} className={'border-2 border-black'}/>
        </div>
    );
}
// * Вручную
const Manually = () => {
    return(
        <div className={'flex flex-col items-center justify-center'}>
            <p className={'txt mb-2 text-xl'}>Текст упражнения</p>
            <textarea id={'txt_ex'} className={'border-2 border-black w-80 h-20 p-2'}></textarea>
        </div>
    );
}

export default createExercise;
import {FC, useEffect, useState} from "react";
import './create-exercise.css'
import {NavigateFunction, useNavigate} from "react-router-dom";
import axios from "axios";

interface CreateExercise {
    exerciseName: string,
    difficultyLevelName: string,
    errors?: number,
    exerciseText?: string,
    autoLength?: number,
    isAuto: boolean
}

interface Zones {
    zone_number: number,
    symbols: string[]
}

export interface ResponseDifficulty {
    name: string,
    zones: Zones[],
    toggle_time: number,
    min_len: number,
    max_len: number,
    max_errors: number
}

const createExercise: FC = () => {
    const [showAuto, setShowAuto] = useState(false);
    const [showManually, setShowManually] = useState(false);
    const [dif, setDif] = useState<ResponseDifficulty[]>([])
    const [selected, setSelected] = useState('');
    const [selectedDif, setSelectedDif] = useState<ResponseDifficulty>(undefined);
    const [errors, setErrors] = useState<string[]>([]);
    const [txtt, setTxtt] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await axios.get<ResponseDifficulty[]>("http://localhost:8080/admin/get-difficulty-levels");
                const response = await axios.get<ResponseDifficulty[]>("http://localhost:8080/admin/get-difficulty-levels", {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    }
                })
                console.log(response.data);
                setDif(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [])

    const save = async (showAuto: boolean) => {
        const titleExInput: HTMLInputElement = document.getElementById("title_ex");
        const titleEx: string = titleExInput.value;
        let exer: CreateExercise;
        const errs: string[] = [];
        if (titleEx.length < 5 || titleEx.length > 20) {
            errs.push("Название упражнения должно быть длиной от 5 до 20 символов!")
        }
        if (selected === '') {
            errs.push("Выберите уровень сложности!")
            return;
        }
        let d: ResponseDifficulty;
        for (const di of dif) {
            if (selected === di.name) {
                d = di;
            }
        }
        if (showAuto) {
            const lenInput: HTMLInputElement = document.getElementById('len_ex');
            const len: number = +lenInput.value;

            if (len > d.max_len || len < d.min_len) {
                errs.push(`Длина для генерации не входит в диапазон [${d.min_len}; ${d.max_len}]!`)
            }

            exer = {
                exerciseName: titleEx,
                difficultyLevelName: selected,
                autoLength: len,
                isAuto: true
            };
            console.log(exer);
        } else {
            const txtArea: HTMLTextAreaElement = document.getElementById("txt_ex");
            const txt: string = txtArea.value;
            if (txt.replace(' ', '').length > d.max_len || txt.replace(' ', '').length < d.min_len) {
                errs.push(`Длина упражнения для ручного ввода не входит в диапазон [${d.min_len}; ${d.max_len}]!`)
            }
            const allowedSymbols: string[] = []
            for (let i = 0; i < d.zones.length; i++) {
                for (const symbols of d.zones[i].symbols) {
                    allowedSymbols.push(symbols);

                }
            }
            const str = allowedSymbols.join('');
            const regex = new RegExp(`^[${str}]*$`); // Создаем регулярное выражение
            if (!regex.test(txt)) {
                errs.push("Текст не соответствует заданным зонам клавиатуры!")
            }
            exer = {
                exerciseName: titleEx,
                difficultyLevelName: selected,
                exerciseText: txt,
                isAuto: false
            }

        }
        console.log(errs);
        setErrors(errs);
        if (errs.length === 0) {
            console.log("POST EXERCISE: \n", exer);
            try {
                const response = await axios.post("http://localhost:8080/admin/create-exercise", exer, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    }
                })
                console.log("POST RESPONSE: ", response.data);
            } catch (err) {
                console.log("POST ERROR! ", err);
            }
            navigate(-1);
        }
    }

// * Автоматический
    const Auto: FC = () => {
        return (
            <div>
                <p className={'txt mb-2'}>Введите необходимую<br/> длину упражнения</p>
                <input id='len_ex' type={'number'} className={'border-2 border-black'}/>
            </div>
        );
    }
// * Вручную
    const Manually = () => {
        return (
            <div className={'flex flex-col items-center justify-center'}>
                <p className={'txt mb-2 text-xl'}>Текст упражнения</p>
                <textarea id={'txt_ex'}
                          className={'border-2 border-black w-80 h-20 p-2'}></textarea>
            </div>
        );
    }


    // console.log("RESPONSE DIF: \n", dif);
    const difficultList = dif.map((d) => <option key={d.name} value={d.name}>{d.name}</option>);
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
    return (
        <div className="bg-gray-200 justify-items-center min-h-screen p-4">
            <div className="bg-white p-8 aspect-square shadow-md">

                <div className='container items-center justify-items-center'>
                    <h1 className='items-center justify-center text-2xl mb-6'>Создание упражнения</h1>
                    {errors.map((e, index) => <p key={index} className={'text-xl text-red-600'}>{e}</p>)}
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
                                const findDif = dif.find(d => d.name === e.target.value);
                                if (findDif !== undefined) {
                                    setSelectedDif(findDif);
                                    console.log(findDif);
                                } else {
                                    setSelectedDif(undefined);
                                }
                            }
                            }
                            className={'border-2 border-black sel '}>
                        <option value={''}></option>
                        {difficultList}
                    </select>
                </div>
                {selectedDif === undefined ? '' : <div className={"flex-col items-center justify-items-center mt-2 text-xl"}>
                    <p>Минимальная длина: &nbsp; {selectedDif.min_len}&nbsp;символов</p>
                    <p>Максимальная длина: &nbsp; {selectedDif.max_len}&nbsp;символов</p>
                    <p>Время нажатия: &nbsp;{selectedDif.toggle_time} &nbsp;секунда</p>
                    <p>Максимальное количество ошибок: &nbsp;{selectedDif.max_errors * 100}% от длины упражнения</p>
                    <p>Допустимые символы: [ {selectedDif.zones.map(z => z.symbols.map(s => s + " "))}]</p>
                </div>}
                <br/>
                <div className={'flex flex-row justify-center space-x-5 mb-2'}>
                    <button onClick={handleAuto} className="bg-gray-300 px-4 py-2">Автоматический</button>
                    <button onClick={handleManually} className="bg-gray-300 px-4 py-2">Вручную</button>
                </div>
                <div className={'container items-center justify-items-center'}>
                    {showAuto && <Auto/>}
                    {showManually && <Manually/>}
                    {
                        (showManually || showAuto) &&
                        <button onClick={() => save(showAuto)}
                                className="bg-gray-300 px-4 py-2 mt-4">Сохранить</button>
                    }
                </div>
            </div>
        </div>);
}

/*async function  save(navigate: NavigateFunction, showAuto: boolean, selected: string, difficulties: ResponseDifficulty[]){
    // const selectElement: HTMLSelectElement = document.getElementById('select_difficult');
    // const sel: string = selectElement.value;
    const titleExInput: HTMLInputElement = document.getElementById("title_ex");
    const titleEx:string = titleExInput.value;
    let exer: CreateExercise;
    const errs:string[] = [];
    if (titleEx.length < 5 || titleEx.length > 20){
        errs.push("Название упражнения должно быть длиной от 5 до 20 символов!")
    }
    if(selected === ''){
        errs.push("Выберите уровень сложности!")
    }
    let difficults: ResponseDifficulty = null;
    for (const difficulty of difficulties) {
        if(selected === difficulty.name){
            difficults = difficulty;
        }
    }
    if(showAuto){
        const lenInput: HTMLInputElement = document.getElementById('len_ex');
        const len: number = +lenInput.value;

        if(len > difficults.max_len || len < difficults.min_len){
            errs.push(`Длина для генерации не входит в диапазон [${difficults.min_len}; ${difficults.max_len}]!`)
        }

        exer = {
            exerciseName: titleEx,
            difficultyLevelName: selected,
            autoLength: len,
            isAuto: true
        };
        console.log(exer);
    }
    else{
        const txtArea: HTMLTextAreaElement = document.getElementById("txt_ex");
        const txt: string = txtArea.value;
        if(txt.length > difficults.max_len || txt.length < difficults.min_len){
            errs.push(`Длина упражнения для ручного ввода не входит в диапазон [${difficults.min_len}; ${difficults.max_len}]!`)
        }
        const allowedSymbols:string[] = []
        for (let i = 0; i < difficults.zones.length; i++) {
            for (const symbols of difficults.zones[i].symbols) {
                allowedSymbols.push(symbols);

            }
        }
        const str = allowedSymbols.join('');
        const regex = new RegExp(`^[${str}]*$`); // Создаем регулярное выражение
        if(!regex.test(txt)){
            errs.push("Текст не соответствует заданным зонам клавиатуры!")
        }
        exer = {
            exerciseName: titleEx,
            difficultyLevelName: selected,
            exerciseText: txt,
            isAuto: false
        }

    }
    console.log(errs);
    if(errs.length === 0){
        console.log("POST EXERCISE: \n",exer);
        try{
            const response = await axios.post("http://localhost:8080/admin/create-exercise", exer, { headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                }})
            console.log("POST RESPONSE: ", response.data);
        }
        catch(err){
            console.log("POST ERROR! ", err);
        }
        navigate(-1);
    }
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
}*/

export default createExercise;
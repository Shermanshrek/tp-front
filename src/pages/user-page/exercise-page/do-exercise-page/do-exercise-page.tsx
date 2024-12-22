import React, {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from 'react';
import './do-exercise.css'
import {NavigateFunction, useLocation, useNavigate, useParams} from "react-router-dom";
import { ResponseExercise } from '../exercise-page';
import {Stats} from "./stats.ts";
import axios from "axios";


const keyboardLayout = [
    ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '<-'],
    ['Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\'],
    ['Caps Lock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter'],
    ['Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'Shift'],
    ['Ctrl', 'Win', 'Alt', ' ', 'Alt', 'Win', 'Ctrl']
];

// const [symbols, setSymbols] = useState(0);
interface Props{
    visibleKeyBoard:boolean,
    exercise_text: string,
    onSymbolCountChange: Dispatch<SetStateAction<number>>,
    onMistakesCountChange:Dispatch<SetStateAction<number>>,
    mistakes: number,
    maxErrors: number,
    symbols: number,
    navigate: NavigateFunction,
    sendStats: () => Promise<void>,
    isActive: boolean,
    setIsActive: Dispatch<SetStateAction<boolean>>
}

const VirtualKeyboard = (props: Props) => {
    const [inputValue, setInputValue] = useState(props.exercise_text);
    const [nextCharIndex, setNextCharIndex] = useState(0);
    const [win, setWin] = useState(false);
    const [mistakes, setMistakes] = useState(false);
    const [readOnlyArea, setReadOnlyArea] = useState(false);
    const handleChange = (e) => {
        setNextCharIndex(e.target.innerText.length); // Обновляем индекс следующего символа
    };

    const getNextChar = () => {
        return inputValue[nextCharIndex] !== undefined ? inputValue[nextCharIndex] : '';
    };
    const handleClosePopup = (func: Dispatch<SetStateAction<boolean>>) => {
        func(false);
        setReadOnlyArea(false);
        props.sendStats();
        props.navigate(-1);
    }

    const nextChar = getNextChar();
    const handleKeyDown = (event) => {
        const enteredChar = event.key;
        console.log(enteredChar);
        // Проверяем, соответствует ли введённый символ следующему символу
        if (enteredChar === nextChar) {
            // Удаляем первый символ из inputValue
            setInputValue((prev) => prev.slice(1));
            setNextCharIndex(nextCharIndex - 1); // Обновляем индекс
            props.onSymbolCountChange((prev: number) => prev + 1);
        }
        else{
            props.onMistakesCountChange(prev => {
                const x = prev + 1
                console.log(x);
                return x
            });
        }

    };

    useEffect(() => {

        if (props.symbols > props.exercise_text.length) {
            setWin(true);
            props.setIsActive(false);
            setReadOnlyArea(true);
            console.log("READONLY:", readOnlyArea);
            // Здесь можно сбросить состояние или выполнить другие действия
        } else if (props.mistakes > props.maxErrors) {
            setMistakes(true);
            props.setIsActive(false);
            setReadOnlyArea(true);
            console.log("READONLY:", readOnlyArea);
            // Здесь можно сбросить состояние или выполнить другие действия
        }
        // Добавляем обработчик события нажатия клавиш
        window.addEventListener('keydown', handleKeyDown);

        // Убираем обработчик при размонтировании компонента
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [nextChar, nextCharIndex, props]); // Зависимости для эффекта


    return (
        <div className={'p-4'}>
           <textarea
               className="border rounded w-full h-32 p-2 mb-4"
               placeholder="Финиш!"
               readOnly={readOnlyArea}
               value={inputValue}
               onChange={handleChange}
           />

            <div hidden={props.visibleKeyBoard} className="grid grid-cols-1 gap-2">
                {keyboardLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex justify-center">
                        {row.map((key, index) => (
                            <button
                                disabled={true}
                                key={index}
                                className={`border rounded p-2 mx-1 transition duration-200 ${
                                    key === nextChar ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                } ${key.length > 1 ? 'w-16' : 'w-10'}`}>
                                {key}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            {win && <Popup message={"Вы прошли упражнение!"} onClose={() => handleClosePopup(setWin)}/>}
            {mistakes && <Popup message={"Вы допустили слишком много ошибок!"} onClose={() => handleClosePopup(setMistakes)} />}
        </div>

    );
}
interface PopupProps {
    message: string;
    onClose: () => void;
}
const Popup: FC<PopupProps> = ({message, onClose}) => {
    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 shadow-lg">
            <p className="flex text-lg font-semibold">{message}</p>
            <button 
                className="mt-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                onClick={onClose}
            >
                Закрыть
            </button>
        </div>
    </div>
    )
}
const doExercise: FC = () => {
    const [checked, setChecked] = useState(false);
    const [id, setId] = useState(0);
    const navigate = useNavigate();
    const {login: login, id: id_exercise } = useParams(); // Извлечение данных из состояния
    const location = useLocation();
    const ex: ResponseExercise = location.state?.ex;
    const [seconds, setSeconds] = useState<number>(0);
    const [symbols, setSymbols] = useState(1);
    const [mistakes, setMistakes] = useState<number>(0);
    const [meanSpeed, setMeanSpeed] = useState(0);
    const [isActive, setIsActive] = useState<boolean>(true);


    const [showPopup, setShowPopup] = useState(false);
    const [pausePopup, setPausePopup] = useState(false);
    const secondsRef = useRef(seconds); // Используем useRef для хранения текущих секунд
    // console.log("DO EXERCISE OBJECT: ", ex);

    // console.log({login, id_exercise});
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => {
                    secondsRef.current = prevSeconds + 1; // Обновляем значение в useRef
                    return secondsRef.current;
                });
                setMeanSpeed(() => symbols / secondsRef.current)

            }, 1000);
        }
        // Очистка интервала при размонтировании или остановке таймера
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isActive]);
    useEffect(() => {
        // Проверка времени в отдельном useEffect
        if (seconds > ex.doTime) {
            setIsActive(false); // Остановить таймер
            setReadOnlyArea(true);
            setShowPopup(true);
        }
    }, [seconds, ex.doTime]); // Зависимость от seconds и ex.doTime


    // Функция для запуска таймера
    const changeTimer = () => {
        setIsActive(!isActive);
        setPausePopup(!pausePopup);
    };

    //Для проигрыша по времени
    const handleClosePopup = () => {
        setShowPopup(false); // Закрыть всплывающее окно
        setIsActive(false);
        setReadOnlyArea(false);
        sendStats();
        navigate(-1);
    };

    //Для паузы
    const handleClosePopup2 = () => {
        setIsActive(true);
        setReadOnlyArea(false)
        setPausePopup(false); // Закрыть всплывающее окно


        // navigate(-1);
    };
    const sendStats = async () => {
        const stats = collectStats();
        if(stats !== undefined){
            try {
                const response = await axios.post<Stats>('http://localhost:8080/user/save-exercise-stat', stats);
                console.log(response.data);
            }catch (err){
                console.log("SEND STATS ERROR\n", err);
            }
        }
    }
    const collectStats: Stats | undefined = (): Stats | undefined => {
        if(login !== undefined){
            const stat: Stats = {
                username: login,
                exerciseId: id_exercise,
                exerciseName: ex.exerciseName,
                errors: mistakes,
                date: new Date(),
                doTime: seconds,
                meanTime: +meanSpeed.toFixed(3)
            }
            console.log(stat);
            return stat
        }
        return undefined;

    }
    const handleRestartPopup = () => {
        setReadOnlyArea(false);
        // sendStats()

    }

    const p: Props = {
        visibleKeyBoard: checked,
        maxErrors: ex.errors,
        exercise_text: ex.exerciseText,
        onSymbolCountChange: setSymbols,
        onMistakesCountChange: setMistakes

    }
    return (
        <div className="flex flex-col items-center p-6 bg-gray-200 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between w-full bg-gray-300 p-4 rounded-lg mb-6">
                <div className={'flex ml-5 space-x-5 '}>
                    <button onClick={() => changeTimer()}
                            className="bg-gray-400 hover:bg-gray-500 text-white btn aspect-square">
                        {isActive ? 'Пауза' : 'Старт'}

                    </button>
                    {/*navigate(`/user/${login}/exercises`, {state:{username: login}, replace:true})*/}
                    <button onClick={() => navigate(-1)}
                            className="bg-gray-400 hover:bg-gray-500 text-white btn aspect-square">
                        Назад
                    </button>
                </div>

                <div className="flex gap-4 text-sm space-x-10 ml-5">
                    {/* Количество набранных символов? */}
                    <span  className={'text-xl'}>Количество символов: {symbols - 1}/{ex.exerciseText.length}</span>
                    <span className={'text-xl'}>Средняя скорость: {meanSpeed.toFixed(2)}</span>
                    <span className={'text-xl'}>Время: {seconds}/{ex.doTime}</span>
                    <span className={'text-xl'}>Ошибки: {mistakes}/{ex.errors}</span>
                </div>
                <div className={'flex'}>
                    <input id={'checkbox-keyboard'} defaultChecked={true} onClick={() => {
                        setChecked(!checked)
                        console.log(checked);
                    }} type={'checkbox'} className={"mt-1 ml-5 size-5"}/>
                    <label htmlFor={'checkbox-keyboard'} className={"ml-2 text-xl"}>Виртуальная клавиатура</label>
                </div>
            </div>
            {pausePopup && <Popup message='Пауза!' onClose={handleClosePopup2}/> }
            {showPopup && <Popup message='Время вышло!' onClose={handleClosePopup}/>}

            {/* Virtual Keyboard */}
            <div className="flex flex-col items-center w-full">
                <div className="w-full bg-gray-100 border border-gray-300 p-2 text-center text-sm overflow-auto mb-4">
                    <div className={''}>
                        <VirtualKeyboard visibleKeyBoard={p.visibleKeyBoard}
                                         exercise_text={ex.exerciseText}
                                         maxErrors={ex.errors}
                                         onSymbolCountChange={setSymbols}
                                         onMistakesCountChange={setMistakes}
                                         mistakes={mistakes}
                                         navigate={navigate}
                                         sendStats={sendStats}
                                         setIsActive={setIsActive}
                                         isActive={isActive}
                                         symbols={symbols}/>
                    </div>
                </div>
            </div>
        </div>
        



    );
};
export default doExercise;
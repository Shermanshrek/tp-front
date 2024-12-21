import React, {FC, useState} from "react";
import './difficult.css'
import {NavigateFunction, useNavigate} from "react-router-dom";
import axios from "axios";
import {instance} from "../../../api.config.ts";



const createDifficult:FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [minLen, setMinLen] = useState(0);
    const [maxLen, setMaxLen] = useState(0);
    const [pressTime, setPressTime] = useState(0);
    const [maxMistakes, setMaxMistakes] = useState(0);
    // const[errors, setErrors] = useState('');
    return (
        <div className="bg-gray-200 justify-items-center min-h-screen p-4">
            <div className="bg-white p-8 aspect-square shadow-md">
                <div className="flex-col px-8 pt-6 pb-8 mb-4 space-y-4">
                    <h1 className='text-2xl hh'>Создание уровня сложности</h1>
                    <br/>
                    <div className="flex items-center mb-4">
                        <label htmlFor="title" className="block mr-4 w-1/3">
                            Название
                        </label>
                        <input type={'text'}
                               value={title}
                               id={'title'}
                               onChange={(e) => setTitle(e.target.value)}
                               className="border-2 border-black  px-3"/>
                    </div>
                    <div className="flex items-center mb-4">
                        <label htmlFor="minLength" className="block  mr-4 w-1/3">
                            Минимальная длина
                        </label>
                        <input type={'number'}
                               value={minLen}
                               id='minLength'
                               onChange={(e) => setMinLen(+e.target.value)}
                               className="border-2 border-black"/>
                    </div>
                    <div className="flex items-center mb-4">
                        <label htmlFor="maxLength" className="block  mr-4 w-1/3">
                            Максимальная длина
                        </label>
                        <input type={'number'}
                               value={maxLen}
                               id={'maxLength'}
                               onChange={(e) => setMaxLen(+e.target.value)}
                               className="border-2 border-black"/>
                    </div>
                    <div className="flex items-center mb-4">
                        <label htmlFor="pressTime" className="block mr-4 w-1/3">
                            Время нажатия
                        </label>
                        <input type={'number'}
                               value={pressTime}
                               id="pressTime"
                               onChange={(e) => setPressTime(+e.target.value)}
                               className="border-2 border-black"/>
                    </div>
                    <div className="flex items-center mb-4">
                        <label htmlFor="maxMistakes" className="block mr-4 w-1/3">
                            Максимальное количество ошибок
                        </label>
                        <input type={'number'}
                               value={maxMistakes}
                               id='maxMistakes'
                               onChange={(e) => setMaxMistakes(+e.target.value)}
                               className="border-2 border-black"/>
                    </div>

                    <h1 className='hh'>Зоны клавиатуры</h1>
                    {/* Создаем массив с номерами чекбоксов */}
                    <div className="flex justify-center space-x-10 ">
                        {[1, 2, 3, 4, 5].map((number) => (
                            <div key={number} className="flex flex-col mb-4">
                                <input
                                    type="checkbox"
                                    id={`checkbox-${number}`}
                                    className="chkbx"
                                />

                                <label htmlFor={`checkbox-${number}`} className="mt-1 ml-1 text-gray-700">
                                    {number}
                                </label>
                            </div>
                        ))}

                    </div>
                    <div className="flex justify-center">
                        <button onClick={() => save(navigate, title, minLen, maxLen, pressTime, maxMistakes)}
                                className="bg-gray-300 py-2">
                            Сохранить
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
// private String name;
// private int min_len;
// private int max_len;
// private double toggle_time;
// private double max_errors;
// private List<Boolean> zones;

interface CreateDifficult{
    name: string,
    min_len: number,
    max_len: number,
    toggle_time: number,
    max_errors: number,
    zones: boolean[]
}
async function save(navigate: NavigateFunction, title: string, minLen: number, maxLen: number, pressTime: number, maxMistakes: number) {
    const checkboxes: HTMLInputElement[] = document.getElementsByClassName("chkbx");
    const listOfChecks: boolean[] = [];
    for (const checkbox of checkboxes) {
     listOfChecks.push(checkbox.checked);
    }
    // * TODO отправлять данные на сервер
    const difficult: CreateDifficult = {
        name: title,
        min_len: minLen,
        max_len: maxLen,
        toggle_time: pressTime,
        max_errors: maxMistakes,
        zones: listOfChecks
    }
    console.log(difficult);
    try{
        const response = await instance.post("/admin/create-difficult", difficult);
        console.log("POST RESPONSE: ", response.data);
    }catch(err){
        console.log("POST ERROR DIFFICULT! ", err);
    }
    
    navigate(-1);
}

export default createDifficult;
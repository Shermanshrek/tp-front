import React, {FC, useState} from "react";
import './difficult.css'
import {NavigateFunction, useNavigate} from "react-router-dom";
import axios from "axios";
import {instance} from "../../../api.config.ts";



const createDifficult:FC = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [minLen, setMinLen] = useState<number>(0);
    const [maxLen, setMaxLen] = useState<number>(0);
    const [pressTime, setPressTime] = useState<number>(0);
    const [maxMistakes, setMaxMistakes] = useState<number>(0);
    const[errors, setErrors] = useState<string[]>([]);

    const save = async () => {
        const checkboxes: HTMLInputElement[] = document.getElementsByClassName("chkbx");
        const listOfChecks: boolean[] = [];
        const errs: string[] = [];

        for (const checkbox of checkboxes) {
            listOfChecks.push(checkbox.checked);
        }
        const difficult: CreateDifficult = {
            name: title,
            min_len: minLen,
            max_len: maxLen,
            toggle_time: pressTime,
            max_errors: maxMistakes,
            zones: listOfChecks
        }

        if(difficult.name.length > 30 || difficult.name.length < 7){
            errs.push("Название должно быть от 7 до 30 символов!")
        }
        if (minLen < 20 || minLen > 150){
            errs.push("Минимальная длина должна быть от 20 символов!")
        }
        if (maxLen > 150 || maxLen < 20){
            errs.push("Максимальная длина должна быть до 150 символов!")
        }
        if(difficult.toggle_time > 1 || difficult.toggle_time < 0.5){
            errs.push("Время нажатия должно быть от 0.5 до 1 сек!")
        }
        if(difficult.max_errors > 0.2 || difficult.max_errors < 0){
            errs.push("Максимальное количество ошибок должно быть от 0 до 0.2!")
        }
        const allFalse = () => {
            for (let i = 0; i < difficult.zones.length; i++) {
                if(difficult.zones[i]){
                    return false;
                }
            }
            return true;
        }
        if(allFalse()){
            errs.push("Должна быть выбрана хотя бы одна зона!")
        }
        setErrors(errs);
        console.log(difficult);
        if(errs.length === 0){
            try{
                const response = await axios.post("http://localhost:8080/admin/create-difficult", difficult, { headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                }})
                console.log("POST RESPONSE: ", response.data);                console.log("POST RESPONSE: ", response.data);
            }catch(err){
                console.log("POST ERROR DIFFICULT! ", err);
            }
            navigate(-1);
        }

        }



    return (
        <div className="bg-gray-200 justify-items-center min-h-screen p-4">
            <div className="bg-white p-8 aspect-square shadow-md">
                <div className="flex-col px-8 pt-6 pb-8 mb-4 space-y-4">
                    <h1 className='text-2xl hh'>Создание уровня сложности</h1>
                    <br/>
                    {errors.map((e, index) => <p key={index} className={'text-xl text-red-600'} >{e}</p>)}
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
                            Максимальное количество ошибок(%)
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
                        <button onClick={() => save()}
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
    min_len?: number,
    max_len?: number,
    toggle_time?: number,
    max_errors?: number,
    zones: boolean[]
}



/*async function save(navigate: NavigateFunction, title: string, minLen: number, maxLen: number, pressTime: number, maxMistakes: number) {
    const checkboxes: HTMLInputElement[] = document.getElementsByClassName("chkbx");
    const listOfChecks: boolean[] = [];
    const[errors, setErrors] = useState<string[]>([]);

    for (const checkbox of checkboxes) {
     listOfChecks.push(checkbox.checked);
    }
    const difficult: CreateDifficult = {
        name: title,
        min_len: minLen,
        max_len: maxLen,
        toggle_time: pressTime,
        max_errors: maxMistakes,
        zones: listOfChecks
    }

    else{
        console.log(difficult);
        try{
            const response = await instance.post("/admin/create-difficult", difficult);
            console.log("POST RESPONSE: ", response.data);
        }catch(err){
            console.log("POST ERROR DIFFICULT! ", err);
        }

        navigate(-1);
    }

}
function isValidDifficult(difficult: CreateDifficult){
    const errors: string[] = [];

    if(difficult.name.length > 30 || difficult.name.length < 7){
        errors.push("Название должно быть больше 7 и меньше 30 символов!");
    }
    if (difficult.min_len === undefined || difficult.max_len === undefined) {
        errors.push("Минимальная и максимальная длина должны быть указаны.");
    } else if (difficult.min_len > difficult.max_len) {
        errors.push("Минимальная длина не может быть больше максимальной.");
    }
    if (difficult.toggle_time <= 0) {
        errors.push("Время нажатия должно быть больше нуля.");
    }
    if (difficult.max_errors <= 0) {
        errors.push("Максимальное количество ошибок должно быть больше нуля.");
    }
    return errors;
}*/

export default createDifficult;
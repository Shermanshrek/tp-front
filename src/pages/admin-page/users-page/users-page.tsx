import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

interface User{
    id: number,
    username: string,
    // ? зачем админу знать пароли пользователей?
    password: string,
    // ! Пока оставим в виде одного поля, но потом расширим, типа из бд нужно получать инфу
    // ! таким образом, сделаем статистику по всем пользователям.
    statistic?: string
}


const users:FC = () => {
    const [users, setUsers] = useState<User[]>([])
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get<User[]>("http://localhost:8080/admin/get-all-users", { headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
            }});
            setUsers(response.data);
        }
        fetchData();
    }, []);

    return (
        <div className={'flex flex-col bg-gray-200 items-center justify-items-center min-h-screen p-4'}>
            <div className="flex flex-col bg-white p-8 aspect-square shadow-md relative">
                <h1 className={'text-2xl'}>Учётные записи</h1>
                <table className="table-auto border-collapse">
                    <thead>
                    <tr className={'items-center'}>
                        <th className={'border border-slate-600'}>id</th>
                        <th className={'border border-slate-600'}>Логин</th>
                        <th className={'border border-slate-600'}>Пароль</th>
                        <th className={'border border-slate-600'}>Удалить пользователя</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        users.map((user) => (
                            <tr key={user.id}>
                                <td className={'border border-slate-600 text-center'}>&nbsp; {user.id} &nbsp;</td>
                                <td className={'border border-slate-600'}>&nbsp; {user.username} &nbsp; </td>
                                <td className={'border border-slate-600'}>&nbsp; {user.password} &nbsp; </td>
                                <td className={'border border-slate-600 py-2 text-center'}>
                                    <button onClick={() => deleteUser(user, setUsers)}
                                            className={'bg-gray-300 py-2 w-32'}>Удалить</button>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                <div className={'flex flex-row mt-5 space-x-5'}>
                    <button onClick={() => navigate(-1)}
                            className={'bg-gray-300 py-2'}>Назад
                    </button>
                </div>
            </div>
        </div>
    );

}

async function deleteUser(user: User, setUsers: Dispatch<SetStateAction<User[]>> ) {
    const response = await axios.delete(`http://localhost:8080/admin/delete-user/${user.id}`, { headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        }});
    setUsers(prev => prev.filter(p => p.id !== user.id))
    console.log(response.data);
}
export default users;

import {FC} from "react";
import {useNavigate} from "react-router-dom";

interface User{
    id: number,
    login: string,
    // ? зачем админу знать пароли пользователей?
    password: string,
    // ! Пока оставим в виде одного поля, но потом расширим, типа из бд нужно получать инфу
    // ! таким образом, сделаем статистику по всем пользователям.
    statistic?: string
}


const users:FC = () => {
    // * TODO цеплять пользователей и статистику с сервера.
    const usr1:User = {id: 1, login: "Labuda12", password: "12345"}
    const usr2:User = {id: 2, login: "Wewe", password: "1414"}
    const usr3:User = {id: 3, login: "Vialka", password: "717cgc"}
    const usersList: User[] = [usr1,usr2,usr3];
    const navigate = useNavigate();

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
                        <th className={'border border-slate-600'}>Статистика</th>
                        <th className={'border border-slate-600'}>Удалить пользователя</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        usersList.map((user) => (
                            <tr key={user.id}>
                                <td className={'border border-slate-600 text-center'}>&nbsp; {user.id} &nbsp;</td>
                                <td className={'border border-slate-600'}>&nbsp; {user.login} &nbsp; </td>
                                <td className={'border border-slate-600'}>&nbsp; {user.password} &nbsp; </td>
                                <td className={'border border-slate-600'}>&nbsp; {user.statistic} &nbsp; </td>
                                <td className={'border border-slate-600 py-2 text-center'}>
                                    <button onClick={() => deleteUser(user, usersList)}
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

// * TODO кидать запрос + скорее всего этот метод придётся в хук useState переделать
function deleteUser(user: User, usersList: User[]) {
    console.log(user);
}

export default users;

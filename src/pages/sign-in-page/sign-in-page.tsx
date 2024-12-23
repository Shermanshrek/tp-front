import {FC, useState} from "react";
import {useNavigate} from "react-router-dom";
import '../registration-page/registration-page.tsx'
import axios from "axios";
import {jwtDecode, JwtHeader} from "jwt-decode";
import AuthService from "../../api.auth";
import {instance} from "../../api.config.ts";


interface UserSignIn{
    username: string,
    password: string
}

const signIn: FC = ()=>{
    const navigate = useNavigate();
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [incorrect, setIncorrect] = useState(false);
    const handleClick = async () =>{
        const user:UserSignIn = {username: login, password: password}
        console.log("SIGN IN USER",user);
        try {
            const resp = await axios.post("http://localhost:8080/auth/sign-in", user);
            // const token = window.localStorage.getItem("token")
            // let decoded: JwtHeader
            // console.log(token)
            const decoded = jwtDecode(resp.data.token)
            window.localStorage.setItem("token", resp.data.token);
            console.log("TOKEN SIGN IN: ", decoded);
            if(decoded.role === "ROLE_USER"){
                const login = decoded.sub
                setIncorrect(false)
                navigate(`/user/${login}`, {replace: false});
            } else if (decoded.role === "ROLE_ADMIN") {
                setIncorrect(false)
                navigate('/admin')
            }

        }catch (err){
            setIncorrect(true)
        }
    }
    return(
       <div className="bg-gray-200 justify-items-center min-h-screen p-4">
           <div className="flex flex-col bg-white p-8 aspect-square shadow-md">
               <div className="py-5 ">
                   {incorrect && <p className={'text-xl text-red-600 mb-3'}>Неверный логин или пароль!</p>}
                   <div className="flex flex-row space-x-5">
                       <p>Логин</p> <input id="login_input" value={login} onChange={(e) => setLogin(e.target.value.trim())} className="border-2 border-black"/>
                   </div>
               </div>
               <div className="flex flex-row space-x-2.5">
                   <p>Пароль</p>  <input id="password_input" value={password} onChange={(e) => setPassword(e.target.value.trim())} type="password" className="border-2 border-black"/>
               </div>
               <div className="flex flex-row space-x-5 py-5 px-8">
                   <button id="registration_btn"
                           onClick={() => navigate('/registration', {replace: false})}
                           className="bg-gray-300 px-4 py-2">Регистрация</button>
                   <button  onClick={() => handleClick()}
                            id='sign_in_btn' className="bg-gray-300 px-4 py-2">Войти</button>
               </div>


           </div>
       </div>
    );
}



export default signIn;
import {FC, useState} from "react";
import {useNavigate} from "react-router-dom";
import '../registration-page/registration-page.tsx'
import axios from "axios";
import {jwtDecode} from "jwt-decode";


interface UserSignIn{
    username: string,
    password: string
}

const signIn: FC = ()=>{
    const navigate = useNavigate();
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const handleClick = async () =>{
        const user:UserSignIn = {username: login, password: password}
        console.log("SIGN IN USER",user);
        try {
            const response = await axios.post('http://localhost:8080/auth/sign-in', user);
            const decoded = jwtDecode(response.data.token);
            // const jsonDecoded = JSON.parse();
            // console.log(jsonDecoded);
            console.log("TOKEN SIGN IN: ", decoded);
            if(decoded.role === "ROLE_USER"){
                const login = decoded.sub
                navigate(`/user/${login}`, {replace: false});
            } else if (decoded.role === "ROLE_ADMIN") {
                navigate('/admin')
            }

        }catch (err){
            console.log(err);
        }
    }
    return(
       <div className="bg-gray-200 justify-items-center min-h-screen p-4">
           <div className="flex flex-col bg-white p-8 aspect-square shadow-md">
               <div className="py-5 ">
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
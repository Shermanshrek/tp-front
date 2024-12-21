import {FC} from "react";
import {useNavigate} from "react-router-dom";

const notFoundPage:FC = () =>{
    const navigate = useNavigate()
    return (
        <div className='flex flex-col items-center justify-center'>
            <p className='text-5xl mb-10'>Страница не найдена!</p>
            <button className={'button-text py-2'}
                    onClick={() => navigate(-1)}>
                <p className={'text-2xl'}>
                    Назад
                </p>
            </button>
        </div>
    );
}
export default notFoundPage;

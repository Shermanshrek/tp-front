import { Navigate, Outlet, Route } from "react-router-dom";
import authStore from "./store.ts";
import { observer } from "mobx-react-lite";

interface Props{
    page?: JSX.Element
    to?: string
}

const PrivateRoute = (props: Props) => {

    if (authStore.isAuthInProgress) {
        return <div>Идёт авторизация...</div>;
    }
    if (authStore.isAuth) {
        // return <Navigate to={props.to}/>
        return (
            <>
                {props.page}
            </>

    );
    } else {
        return <Navigate to="/sign-in" />;
    }
};


export default observer(PrivateRoute);
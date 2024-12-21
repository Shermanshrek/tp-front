// import './App.css'
import '../styles.css'
import '../output.css'

import StartPage from "./pages/start-page/start-page.tsx"
import {Route, Routes, useLocation} from "react-router-dom";
import About from "./pages/about-page/about-page.tsx";
import NotFoundPage from "./pages/not-found-page/not-found-page.tsx";
import {useEffect} from "react";
import SignInPage from "./pages/sign-in-page/sign-in-page.tsx";
import Registration from "./pages/registration-page/registration-page.tsx";
import UserPage from "./pages/user-page/user-page.tsx";
import AdminPage from "./pages/admin-page/admin-page.tsx";
import CreateDifficultPage from "./pages/admin-page/create-difficult-page/create-difficult-page.tsx";
import CreateExercisePage from "./pages/admin-page/create-exercise-page/create-exercise-page.tsx";
import DoExercisePage from "./pages/user-page/exercise-page/do-exercise-page/do-exercise-page.tsx";
import ExercisePage from "./pages/user-page/exercise-page/exercise-page.tsx";
import StatisticPage from "./pages/user-page/statistic-page/statistic-page.tsx";
import UsersPage from "./pages/admin-page/users-page/users-page.tsx";
import AdminExercisesPage from "./pages/admin-page/exercises-page/admin-exercises-page.tsx";
import AdminStatisticPage from "./pages/admin-page/statistic-page/admin-statistic-page.tsx";
import AuthStore  from "./store.ts";
import PrivateRoute from "./privateRoute.tsx";
import {observer} from "mobx-react-lite";

const App = observer(() => {

    const location = useLocation();
    useEffect(() => {
        AuthStore.checkAuth();
    }, []);

    return(
        <Routes>
            <Route path={'/'} element={<StartPage/>}/>
            <Route path={'about'} element={<About/>}/>
            <Route path={'/sign-in'} element={<SignInPage/>}/>
            <Route path={'/registration'} element={<Registration/>}/>

            <Route path={'/admin'} element={<PrivateRoute page={<AdminPage/>}/> }/>
            <Route path={'/admin/create-difficult'} element={<PrivateRoute page={<CreateDifficultPage/>}/>}/>
            <Route path={'/admin/create-exercise'} element={<PrivateRoute page={<CreateExercisePage/>}/> }/>
            <Route path={'/admin/exercises'} element={<PrivateRoute page={<AdminExercisesPage/>}/>}/>
            <Route path={'/admin/users'} element={<PrivateRoute page={<UsersPage/>}/>}/>
            <Route path={'/admin/statistic'} element={<PrivateRoute page={<AdminStatisticPage/>}/> }/>
            <Route path={'/admin/exercises/:id'} element={<PrivateRoute page={<DoExercisePage/>}/>}/>

            <Route path={`user/:login`} element={<PrivateRoute page={<UserPage/>}/>}/>
            <Route path={`user/:login/exercises`} element={<PrivateRoute page={<ExercisePage/>}/>}/>
            <Route path={`user/:login/statistic`} element={<PrivateRoute page={<StatisticPage/>}/>}/>
            <Route path={`user/:login/exercises/:id`} element={<PrivateRoute page={<DoExercisePage/>}/>}/>

            <Route path={'*'} element={<NotFoundPage/>}/>
        </Routes>
    );
})

export default App

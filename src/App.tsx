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

function App() {
    const location = useLocation();
    useEffect(() => {
        console.log('Current location is ', location);
    }, [location]);

    return(
        <Routes>
            <Route path={'/'} element={<StartPage isLoggedIn={false}/>}/>
            <Route path={'about'} element={<About/>}/>
            <Route path={'/sign-in'} element={<SignInPage/>}/>
            <Route path={'/registration'} element={<Registration/>}/>

            <Route path={'/admin'} element={<AdminPage/>}/>
            <Route path={'/admin/create-difficult'} element={<CreateDifficultPage/>}/>
            <Route path={'/admin/create-exercise'} element={<CreateExercisePage/>}/>
            <Route path={'/admin/exercises'} element={<AdminExercisesPage/>}/>
            <Route path={'/admin/users'} element={<UsersPage/>}/>
            <Route path={'/admin/statistic'} element={<AdminStatisticPage/>}/>
            <Route path={'/admin/exercises/:id'} element={<DoExercisePage/>}/>

            <Route path={`/user/:login`} element={<UserPage/>}/>
            <Route path={`/user/:login/exercises`} element={<ExercisePage/>}/>
            <Route path={`/user/:login/statistic`} element={<StatisticPage/>}/>
            <Route path={`/user/:login/exercises/:id`} element={<DoExercisePage/>}/>

            <Route path={'*'} element={<NotFoundPage/>}/>
        </Routes>
    );
}

export default App

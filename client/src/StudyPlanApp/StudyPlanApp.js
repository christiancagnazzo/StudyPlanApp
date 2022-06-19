import '../css.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { HomeLayout, LoggedHomeLayout } from './Layout/Home'
import { NavB } from './Layout/NavB'
import { InitialLoading, NotFoundLayout, ErrorLayout } from './Layout/Layout';
import React, { useEffect, useState } from 'react';
import API from './API';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginForm } from './Layout/Login'
import { UserContext } from './UserContext';
import { Container } from 'react-bootstrap';


function StudyPlanApp() {
    const [courses, setCourses] = useState([]);
    const [initialCoursesLoading, setInitialCoursesLoading] = useState(true);
    const [user, setUser] = useState(undefined);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    function handleError(err) {
        setErrorMessage(err);
        navigate('/error');
    }

    /* SET ALL COURSES */
    useEffect(() => {
        if (initialCoursesLoading) {
            API.getAllCoursesCompleted()
                .then((courses) => {
                    const orderedCourses = courses.sort(function (a, b) {
                        if (a.name < b.name) { return -1; }
                        if (a.name > b.name) { return 1; }
                        return 0;
                    })
                    setErrorMessage('');
                    setCourses(orderedCourses);
                    setInitialCoursesLoading(false);
                })
                .catch(err => handleError(err))
        }
    }, [initialCoursesLoading])

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await API.getUserInfo();
                setLoggedIn(true);
                setUser(user);
            } catch (err) {
                setLoggedIn(false);
                setUser(undefined);
            }
        };

        checkAuth();
    }, []);

    const doLogIn = (credentials) => {
        API.logIn(credentials)
            .then(user => {
                setLoggedIn(true);
                setUser(user);
                setLoginMessage('');
                navigate('/logged-home');
            })
            .catch(err => {
                handleError(err);
            })
    }

    const doLogOut = async () => {
        await API.logOut();
        setLoggedIn(true);
        setUser(undefined);
        setCourses([]);
        setInitialCoursesLoading(true);
        navigate('/');
    }

    return (
        <>
            <Container fluid className='cust'>
                <UserContext.Provider value={user}>
                    <NavB logout={doLogOut} />

                    <Routes>
                        <Route path="/" element={<Navigate to="/home" />} />
                        <Route path="/home" element={initialCoursesLoading ? <InitialLoading /> : <HomeLayout courses={courses}></HomeLayout>} />
                        <Route path="/login" element={<LoginForm login={doLogIn} message={loginMessage} setMessage={setLoginMessage} />} />
                        <Route path="/error" element={errorMessage ? <ErrorLayout message={errorMessage} /> : <NotFoundLayout />} />
                        <Route path="*" element={<NotFoundLayout />} />

                        <Route path="/logged-home" element={
                            initialCoursesLoading ? <InitialLoading /> : (
                                !loggedIn ? <Navigate to='/login' /> : <LoggedHomeLayout setInitialCoursesLoading={setInitialCoursesLoading} courses={courses} setCourses={setCourses} setErrorMessage={setErrorMessage}></LoggedHomeLayout>
                            )
                        } />

                        <Route path="/logged-home/edit" element={
                            initialCoursesLoading ? <InitialLoading /> : (
                                !loggedIn ? <Navigate to='/login' /> : <LoggedHomeLayout setInitialCoursesLoading={setInitialCoursesLoading} courses={courses} setCourses={setCourses} setErrorMessage={setErrorMessage}></LoggedHomeLayout>
                            )
                        } />

                    </Routes>

                </UserContext.Provider>
            </Container>
        </>
    )
}

export { StudyPlanApp }
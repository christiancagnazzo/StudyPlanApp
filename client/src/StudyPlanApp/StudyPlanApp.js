import '../css.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { HomeLayout } from './Layout/Home'
import { NavB } from './Layout/NavB'
import React, { useEffect, useState } from 'react';
import API from './API';


function StudyPlanApp() {
    const [courses, setCourses] = useState([]);
    const [initialCoursesLoading, setInitialCoursesLoading] = useState(true);


    function handleError(err) {
        /* TODO */
        //setErrorMessage(err);
        //navigate('/error');
        console.log(err)
    }

    /* SET ALL COURSES */
    useEffect(() => {
        // TODO:  quando aggiungo nel piano carriera perchè si aggiorna il count studenti !!!
        if (initialCoursesLoading) {
            API.getAllCoursesCompleted()
                .then((courses) => {
                    const orderedCourses = courses.sort(function (a, b) {
                        if (a.name < b.name) { return -1; }
                        if (a.name > b.name) { return 1; }
                        return 0;
                    })
                    setCourses(orderedCourses);
                    setInitialCoursesLoading(false);
                })
                .catch(err => handleError(err))
        }
    }, [initialCoursesLoading])

    return (
        <>
            <NavB />
            <HomeLayout courses={courses} />
        </>
    )
}

export { StudyPlanApp }
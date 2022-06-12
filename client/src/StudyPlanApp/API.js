const APIURL = new URL('http://localhost:3001/api/');

/* COURSES */

/*
async function getAllCourses() {
    // call: GET /api/courses
    const response = await fetch(new URL('courses', APIURL));

    if (response.ok) {
        const coursesJson = await response.json();
        return coursesJson.map((co) => ({ code: co.code, name: co.name, cfu: co.cfu, preparatory: co.preparatory, maxStudents: co.maxStudents }));
    } else {
        throw new Error("Something wrong. Try reloading the page");
    }
}

async function getIncompatibleCourses(code) {
    // call: GET /api/courses/:id/incompatibles
    const response = await fetch(new URL('courses/' + code + '/incompatibles', APIURL));
    const coursesJson = await response.json();
    if (response.ok) {
        return coursesJson.map((co) => ({ code: co.code, name: co.name, cfu: co.cfu }));
    } else {
        throw new Error("Something wrong. Try reloading the page");
    }
}

async function getStudentsCourse(code) {
    // call GET /api/courses/:id/students
    const response = await fetch(new URL('courses/' + code + '/students', APIURL));
    const studentsJson = await response.json();
    if (response.ok) {
        return studentsJson
    } else {
        throw new Error("Something wrong. Try reloading the page");
    }
}
*/

async function getAllCoursesCompleted() {
    await new Promise(r => setTimeout(r, 100)); // to simulate loading

    // call: GET /api/courses
    const response = await fetch(new URL('courses', APIURL));

    if (response.ok) {
        const coursesJson = await response.json();
        return coursesJson.map((co) => ({ 
            code: co.code, 
            name: co.name, 
            cfu: co.cfu, 
            preparatory: co.preparatory, 
            maxStudents: co.maxStudents,
            incompatibles: co.incompatibles,
            students: co.students,
            full: co.full
        }));
    } else {
        throw new Error("Something wrong. Try reloading the page");
    }
}

/* --------------------------------- */

/* USER AUTHENTICATION */

async function getUserInfo() {
    const response = await fetch(new URL('sessions/current', APIURL), { credentials: 'include' });

    if (response.ok) {
        const userInfo = await response.json();
        return userInfo;
    } else {
        throw new Error("Something wrong. Try reloading the page");
    }
}

async function logIn(credentials) {
    let response = await fetch(new URL('sessions', APIURL), {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function logOut() {
    await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
}


/* --------------------------------- */

/* STUDY PLAN */

async function getStudyPlanInformation() {
    // call: GET /api/studyplan
    const response = await fetch(new URL('studyplan', APIURL), {
        method: 'GET',
        credentials: 'include'
    });

    if (response.status === 404) {
        return { type: "-", cfu: 0, mincfu: "-", maxcfu: "-", courses: [] };
    }

    const studyPlanJson = await response.json();

    // call: GET /api/studyplan/:code/courses
    const resp = await fetch(new URL('studyplan/courses', APIURL), {
        method: 'GET',
        credentials: 'include'
    });

    if (!resp.ok) {
        throw new Error("Something wrong. Try reloading the page");
    }

    const coursesJson = await resp.json();

    studyPlanJson.courses = coursesJson;
    studyPlanJson.cfu = coursesJson.reduce((sum, c) => sum + c.cfu, 0)

    return studyPlanJson;

}

async function saveStudyPlan(studyPlan) {
    // call: POST /api/studyPlan
    const response = await fetch(new URL('studyPlan', APIURL), {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: studyPlan.type, courses: studyPlan.courses }),
    });

    if (!response.ok) {
        const error = (await response.json()).error;
        throw error;
    }
}

async function deleteStudyPlan() {
    // call: DELETE /api/studyPlan
    const response = await fetch(new URL('studyPlan', APIURL), {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = (await response.json()).error;
        throw new Error(error);
    }
}

/* --------------------------------- */

const API = { getAllCoursesCompleted, logIn, logOut, getUserInfo, getStudyPlanInformation, saveStudyPlan, deleteStudyPlan };
export default API;



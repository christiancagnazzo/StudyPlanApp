const APIURL = new URL('http://localhost:3001/api/');

async function getAllCoursesCompleted() {
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
    const resp = await fetch(new URL('studyplan', APIURL), {
        method: 'GET',
        credentials: 'include'
    });

    if (resp.status === 404) {
        return { type: "-", cfu: 0, mincfu: "-", maxcfu: "-", courses: [] };
    }

    if (!resp.ok) {
        throw new Error("Something wrong. Try reloading the page");
    }

    const studyPlanJson = await resp.json();

    return studyPlanJson;

}

async function saveStudyPlan(studyPlan) {
    
    let courses = [];
    studyPlan.courses.forEach(element => {
        courses.push(element.code);
    });

    // call: POST /api/studyPlan
    const response = await fetch(new URL('studyPlan', APIURL), {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: studyPlan.type, courses: courses}),
    });

    if (response.status === 422) {
        const error = {myError: (await response.json()).error};
        throw error
    }

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



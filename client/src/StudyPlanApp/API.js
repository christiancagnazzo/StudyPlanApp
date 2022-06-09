const APIURL = new URL('http://localhost:3001/api/');

/* COURSES */

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

async function getAllCoursesCompleted() {
    // return all courses completed (with students number and incompatibily)
    await new Promise(r => setTimeout(r, 1000)); // to simulate loading

    const res = await getAllCourses();

    for (let i = 0; i < res.length; i++) {
        res[i].incompatibles = await getIncompatibleCourses(res[i].code);
        res[i].students = (await getStudentsCourse(res[i].code)).students;
        res[i].full = res[i].maxStudents ? (res[i].maxStudents == res[i].students ? true : false) : false
    }

    return res;
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

const API = { getAllCoursesCompleted, logIn, logOut, getUserInfo };
export default API;



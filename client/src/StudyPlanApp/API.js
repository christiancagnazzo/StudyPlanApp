const APIURL = new URL('http://localhost:3001/api/');

async function getAllCourses() {
    // call: GET /api/courses
    const response = await fetch(new URL('courses', APIURL));
    
    if (response.ok) {
        const coursesJson = await response.json();
        return coursesJson.map((co) => ({ code: co.code, name: co.name, cfu: co.cfu, preparatory: co.preparatory, maxStudents: co.maxStudents }));
    } else {
        throw new Error("Something wrong");  // ok ?
    }
}

async function getIncompatibleCourses(code) {
    // call: GET /api/courses/:id/incompatibles
    const response = await fetch(new URL('courses/' + code + '/incompatibles', APIURL));
    const coursesJson = await response.json();
    if (response.ok) {
        return coursesJson.map((co) => ({ code: co.code, name: co.name, cfu: co.cfu}));
    } else {
        throw coursesJson;  // an object with the error coming from the server
    }
}

async function getStudentsCourse(code) {
    // call GET /api/courses/:id/students
    const response = await fetch(new URL('courses/' + code + '/students', APIURL));
    const studentsJson = await response.json();
    if (response.ok) {
        return studentsJson
    } else {
        throw studentsJson;  // an object with the error coming from the server
    }
}

async function getAllCoursesCompleted() {
    // return all courses completed (with students number and incompatibily)
    await new Promise(r => setTimeout(r, 1000)); // to simulate loading
    const res = await getAllCourses();

    for (let i = 0; i < res.length; i++) {
        let inc = await getIncompatibleCourses(res[i].code);
        res[i].incompatibles = inc;
        let num = await getStudentsCourse(res[i].code);
        res[i].students = num.students;
        if (res[i].maxStudents)
            res[i].full = res[i].maxStudents == res[i].students ? true : false
    }

    return res;
}


const API = { getAllCoursesCompleted };
export default API;



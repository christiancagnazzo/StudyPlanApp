'use strict';

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('PSDB.db', (err) => {
    db.run("PRAGMA foreign_keys = ON");
    if (err) throw err;
});

// get course by code
exports.getCourse = (code) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT C1.*, C2.name as prepName  FROM course C1 left join course C2 on c1.preparatory = c2.code WHERE c1.code = ?';
        db.get(sql, [code], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (!row)
                reject({custom_msg: "Course "+code+" not found"})
            else {
                const course = { code: row.code, name: row.name, cfu: row.cfu, preparatory: {code: row.preparatory, name: row.prepName}, maxStudents: row.maxStudents }
                resolve(course);
            }
        });
    });
};

// get all courses
exports.allCourses = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT C1.*, C2.name as prepName  FROM course C1 left join course C2 on c1.preparatory = c2.code';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const courses = rows.map((e) => ({ code: e.code, name: e.name, cfu: e.cfu, preparatory: {code: e.preparatory, name: e.prepName}, maxStudents: e.maxStudents }));
            resolve(courses);
        });
    });
};

// get all incompatible courses of a course
exports.incompatiblesCoursesByCode = (code) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT secondCode, name, cfu FROM incompatibleCourse JOIN course ON course.code=secondCode WHERE firstCode = ?';
        db.all(sql, [code], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const courses = rows.map((e) => ({ code: e.secondCode, name: e.name, cfu: e.cfu }));
            resolve(courses);
        });
    });
};

// get number students of a course
exports.studentsCourse = (code) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM coursesStudyPlan WHERE course = ?';
        db.all(sql, [code], (err, rows) => {
            if (err) {
                reject(err);
                return
            }
            const len = rows.length;
            resolve(len);
        });
    });
};

// get number students of a course
exports.studentsCourseWithoutUser = (code, user) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM coursesStudyPlan JOIN studyPlan  \
                    ON studyPlan = id WHERE course = ? AND user != ?';
        db.all(sql, [code, user], (err, rows) => {
            if (err) {
                reject(err);
                return
            }
            const len = rows.length;
            resolve(len);
        });
    });
};

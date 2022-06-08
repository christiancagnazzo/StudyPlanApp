'use strict';

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('PSDB.db', (err) => {
    if (err) throw err;
});

// get course by code
exports.getCourse = (code) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM course WHERE code = ?';
        db.get(sql, [code], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (!row)
                reject()
            else {
                const course = { code: row.code, name: row.name, cfu: row.cfu, preparatory: row.preparatory, maxStudents: row.maxStudents }
                resolve(course);
            }
        });
    });
};

// get all courses
exports.allCourses = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM course';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const courses = rows.map((e) => ({ code: e.code, name: e.name, cfu: e.cfu, preparatory: e.preparatory, maxStudents: e.maxStudents }));
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

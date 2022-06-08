'use strict';

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('PSDB.db', (err) => {
    if (err) throw err;
});

// get study plan by user id
exports.studyPlan = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM studyPlan WHERE user = ?';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return
            }

            if (rows.length === 0) {
                resolve({ error: "Study Plan not found" })
                return
            }

            const studyPlan = { id: rows[0].id, type: rows[0].type, mincfu: rows[0].min, maxcfu: rows[0].max };
            resolve(studyPlan);
        });
    });
};

// get study plan by  id
exports.studyPlanById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM studyPlan WHERE id = ?';
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
                return
            }

            if (rows.length === 0) {
                resolve({ error: "Study Plan not found" })
                return
            }

            const studyPlan = { id: rows[0].id, type: rows[0].type, mincfu: rows[0].min, maxcfu: rows[0].max };
            resolve(studyPlan);
        });
    });
};

// get all courses of a study plan
exports.studyPlanCourses = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT course, name, cfu \
                    FROM coursesStudyPlan JOIN course ON course.code = coursesStudyPlan.course  \
                                        JOIN studyPlan ON studyPlan.id = coursesStudyPlan.studyPlan \
                    WHERE user = ?';
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            if (rows.length === 0) {
                resolve({ error: "Study Plan not found" })
                return
            }

            const courses = rows.map((e) => ({ code: e.course, name: e.name, cfu: e.cfu }));
            resolve(courses);
        });
    });
};
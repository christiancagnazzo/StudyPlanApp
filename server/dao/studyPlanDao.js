'use strict';

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('PSDB.db', (err) => {
    db.run("PRAGMA foreign_keys = ON");
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


// delete study plan by user id
exports.deleteStudyPlan = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM studyPlan WHERE user = ?';
        db.run(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return
            } else {
                resolve()
                return
            }
        });
    });
};

// create study plan 
exports.createStudyPlan = (userId, type) => {
    return new Promise((resolve, reject) => {

        const min = type === 'FULLTIME' ? 60 : 20;
        const max = type === 'FULLTIME' ? 80 : 40;

        const sql = 'INSERT INTO studyPlan(type, user, min, max) VALUES (?,?,?,?)';
        db.run(sql, [type, userId, min, max], function (err) {
            if (err) {
                reject(err);
                return
            } else {
                resolve(this.lastID);
                return
            }
        });
    });
};

// create study plan 
exports.insertCourseIntoSD = (studyPlanId, courseId) => {
    return new Promise((resolve, reject) => {

        const sql = 'INSERT INTO coursesStudyPlan VALUES (?,?)';
        db.run(sql, [studyPlanId, courseId], function (err) {
            if (err) {
                reject(err);
                return
            } else {
                resolve(this.changes);
                return
            }
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

/* TRANSACTION */

exports.beginTransaction = () => {
    return new Promise((resolve, reject) => {
        const sql = 'begin transaction';

        db.run(sql, (err) => {
            if (err)
                reject(err);
            else
                resolve(this);
        });
    });
}

exports.commitTransaction = () => {
    return new Promise((resolve, reject) => {
        const sql = 'commit';

        db.run(sql, (err) => {
            if (err)
                reject(err);
            else
                resolve(this);
        });
    });
}

exports.rollbackTransaction = () => {
    return new Promise((resolve, reject) => {
        const sql = 'rollback';

        db.run(sql, (err) => {
            if (err)
                reject(err);
            else
                resolve(this);
        });
    });
}
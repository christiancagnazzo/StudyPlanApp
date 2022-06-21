const express = require("express");
const { check, validationResult } = require('express-validator'); // validation middleware
const router = express.Router();
const courseDao = require('../dao/courseDao'); // module for accessing the DB
const studyPlanDao = require('../dao/studyPlanDao'); // module for accessing the DB

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'User not authenticated' });
}
/* ------------------------------------ */

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param }) => {
  return `${location} [${param}]: ${msg}`;
};
/* ------------------------------------ */


// GET /api/studyplan/
// Get the study plan with the courses, if exists
router.get('/studyplan', isLoggedIn, async (req, res) => {
  const userId = req.user.id;

  try {
    let s = await studyPlanDao.studyPlan(userId);
    if (s.error)
      return res.status(404).json(s);

    let c = await studyPlanDao.studyPlanCourses(userId);
    s.courses = c;

    s.cfu = c.reduce((sum, c) => sum + c.cfu, 0)

    return res.status(200).json(s);

  } catch (err) {
    res.status(500).json({ error: `Database error while retrieving courses: ` + err }).end()
  }
});

// DELETE /api/studyplan
// Delete studyplan by user id
router.delete('/studyplan/', isLoggedIn, async (req, res) => {
  const userId = req.user.id;

  try {
    await studyPlanDao.deleteStudyPlan(userId);
    return res.status(204).end()

  } catch (err) {
    res.status(500).json({ error: `Database error while retrieving courses: ` + err }).end()
  }
});

// POST /api/studyPlan
router.post('/studyPlan', isLoggedIn,
  [
    check('type').isString(),
    check('courses').isArray(),
    check('courses.*').isString(),
  ],
  async (req, res) => {
    const err = validationResult(req).formatWith(errorFormatter); // format error message
    if (!err.isEmpty()) {
      return res.status(422).json({ error: err.array().join(", ") }); // error message is a single string with all error joined together
    }

    const type = req.body.type;
    const courses = req.body.courses;
    const userId = req.user.id;

    let error = [];
    let sum_cfu = 0;

    /* check type */
    if (!type || (type !== 'PARTIME' && type !== 'FULLTIME')) {
      error.push("Type not valid");
    }

    for (let i = 0; i < courses.length; i++) {

      try {

        let c = await courseDao.getCourse(courses[i]);

        /* check limit */
        if (c.maxStudents) {
          let students = await courseDao.studentsCourseWithoutUser(c.code, userId);
          if (students === c.maxStudents)
            error.push("Course '" + c.name + "' is full");
        }

        /* check preparatory */
        if (c.preparatory.code && !courses.some(e => e.code === c.preparatory.code)) {
          error.push("Course '" + c.preparatory.name + "' is preparatory for '" + c.name + "' and must be included");
        }

        const incompatibles = await courseDao.incompatiblesCoursesByCode(c.code);

        /* check incompatibilies */
        for (let y = 0; y < incompatibles.length; y++) {
          if (courses.includes(incompatibles[y].code)) {
            error.push("Course '" + c.name + "' is incompatible with '" + incompatibles[y].name);
          }
        }

        sum_cfu += c.cfu;
      } catch (err) {
        if (err.custom_msg)
          error.push(err.custom_msg);
        return res.status(500).json(err);
      }
    };

    /* check cfu */
    if ((type === 'PARTIME' && (sum_cfu < 20 || sum_cfu > 40)) ||
      (type === 'FULLTIME' && (sum_cfu < 60 || sum_cfu > 80)))
      error.push("Credits entered higher or lower than the minimum and maximum credits of the career plan type");

    if (error.length > 0)
      return res.status(422).json({ error: error });

    try {
      await studyPlanDao.deleteStudyPlan(userId);
      let id = await studyPlanDao.createStudyPlan(userId, req.body.type);

      for (let i = 0; i < courses.length; i++) {
        await studyPlanDao.insertCourseIntoSD(id, courses[i])
      }

    } catch (err) {
      return res.status(500).json(err)
    }

    return res.status(201).end()
  });

module.exports = router;
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


// GET /api/studyplan
// Get studyplan by user id
router.get('/studyplan/', isLoggedIn, async (req, res) => {
  const userId = req.user.id;

  try {
    let s = await studyPlanDao.studyPlan(userId);
    if (s.error)
      return res.status(404).json(s)
    else
      return res.status(200).json(s)
  } catch (err) {
    res.status(500).json({ error: `Database error while retrieving courses: ` + err }).end()
  }
});


// GET /api/studyplan/:code/courses
// Get all courses of a studyplan identified by user
router.get('/studyplan/courses', isLoggedIn, async (req, res) => {
  const userId = req.user.id;

  try {
    let c = await studyPlanDao.studyPlanCourses(userId);
    if (c.error)
      return res.status(404).json(c)
    else
      return res.status(200).json(c)
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
router.post('/studyPlan', isLoggedIn, async (req, res) => {

  const type = req.body.type;
  const courses = req.body.courses;
  const userId = req.user.id;

  let error = [];

  /* check type */
  if (!type || (type !== 'PARTIME' && type !== 'FULLTIME')) {
    error.push("Type not valid");
  }

  /* check cfu */
  const cfu = courses.reduce((sum, c) => sum + c.cfu, 0);
  if ((type === 'PARTIME' && (cfu < 20 || cfu > 40)) ||
    (type === 'FULLTIME' && (cfu < 60 || cfu > 80)))
    error.push("Credits entered higher or lower than the minimum and maximum credits of the career plan type");

  for (let i = 0; i < courses.length; i++) {
    /* check limit */
    if (courses[i].maxStudents) {
      let students = await courseDao.studentsCourse(courses[i].code);
      console.log(students);
      if (students !== courses[i].maxStudents)
        error.push("Course '" + courses[i].name + "' is full");
    }

    /* check preparatory */
    if (courses[i].preparatory.code && !courses.some(e => e.code === courses[i].preparatory.code)) {
      error.push("Course '" + courses[i].preparatory.name + "' is preparatory for '" + courses[i].name + "' and must be included");
    }

    const incompatibles = courses[i].incompatibles;

    /* check incompatibilies */
    for (let y = 0; y < incompatibles.length; y++) {
      if (courses.some(e => e.code === incompatibles[y].code)) {
        error.push("Course '" + courses[i].name + "' is incompatible with '" + incompatibles[y].name);
      }
    } // TODO: messaggio di errore doppio !!
    // TODO: controllare se selezionato due volte?? 
  };

  if (error.length > 0)
    return res.status(422).json({ error: error });

  // TODO MIGLIORARE VALIDAZIONE BODY (CORSI) ??? 
  // TODO TRANSAZIONE ???
  // TODO catch ????

  await studyPlanDao.deleteStudyPlan(userId);
  let id = await studyPlanDao.createStudyPlan(userId, req.body.type);

  console.log(id);
  console.log(courses);
  for (let i = 0; i < courses.length; i++) {
    try {
      await studyPlanDao.insertCourseIntoSD(id, courses[i].code)
    } catch {
      return res.status(400).end()
    }
  }

  return res.status(201).end()
});

module.exports = router;
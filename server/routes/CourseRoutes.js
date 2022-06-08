const express = require("express");
const { check, validationResult } = require('express-validator'); // validation middleware
const router = express.Router();
const courseDao = require('../dao/courseDao'); // module for accessing the DB

// GET /api/courses 
// Get all courses
router.get('/courses', async (req, res) => {
  courseDao.allCourses()
    .then(courses => res.status(200).json(courses))
    .catch((err) => {
      res.status(500).json({ error: `Database error while retrieving courses: ` + err }).end()
    });
});


// GET /api/courses/:id/incompatibles
// Get all courses incomatibles with a course identified by id
router.get('/courses/:code/incompatibles', [
  check('code').isString().isLength({ min: 7, max: 7 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    await courseDao.getCourse(req.params.code);
  } catch {
    return res.status(404).json({ error: "Course not found" })
  }

  courseDao.incompatiblesCoursesByCode(req.params.code)
    .then(courses => res.status(200).json(courses))
    .catch((err) => {
      res.status(500).json({ error: `Database error while retrieving courses: ` + err }).end()
    });
});



// GET /api/courses/:id/students
// Get number of students of a course by id
router.get('/courses/:code/students', [
  check('code').isString().isLength({ min: 7, max: 7 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    await courseDao.getCourse(req.params.code);
  } catch {
    return res.status(404).json({ error: "Course not found" })
  }

  courseDao.studentsCourse(req.params.code)
    .then(count => res.status(200).json({ students: count }))
    .catch((err) => {
      res.status(500).json({ error: `Database error while retrieving courses: ` + err }).end()
    });
});


module.exports = router;


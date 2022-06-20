const express = require("express");
const router = express.Router();
const courseDao = require('../dao/courseDao'); // module for accessing the DB

// GET /api/courses 
// Get all courses, with all informations
router.get('/courses', async (req, res) => {
  courseDao.allCourses()
    .then(async courses => {

      for (let i = 0; i < courses.length; i++) {
        courses[i].incompatibles = await courseDao.incompatiblesCoursesByCode(courses[i].code);
        courses[i].students = await courseDao.studentsCourse(courses[i].code);
        courses[i].full = courses[i].maxStudents ? (courses[i].maxStudents == courses[i].students ? true : false) : false
      }

      res.status(200).json(courses)
    })
    .catch((err) => {
      res.status(500).json({ error: `Database error while retrieving courses: ` + err }).end()
    });
});


module.exports = router;


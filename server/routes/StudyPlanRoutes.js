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


module.exports = router;
# Study Plan App 

A full-stack application to manage the university study plan. The project has been implemented for the  "Web Application I" university course.

## React Client Application Routes

- Route `/`: always redirects to `/home`
- Route `/login`: contains the form to login
- Route `/home`: contains the list of courses and their information; it is also accessible by non-logged in users
- Route `/logged-home`: contains the list of courses on the left and the study plan, if any, on the right; it is reachable only by logged in users
- Route `/logged-home/edit`: as logged-home, but also enables buttons to edit the study plan and shows additional information about courses that cannot be added or that are subject to constraints 
- Route `/error`: it is addressed in case of serious server-side errors (such as unreachable database) and shows an error message, but is not reachable if there are no errors


## API Server

- POST `/api/sessions` 
  - Description: Allows to authenticate the user to initialize a session
  - Request body: Object containing user credentials (Content-Type: application/json)
  
  ```
  {
    "username": "s100100@polito.it",
    "password": "1234"
  }
  ```

  - Response: `200 OK` 
  - Response body: Object that represents the user (Content-Type: application/json)
  ```
  {
    "id": 1,
    "username": "s1@polito.it",
    "name": "Utente s1"
  }
  ```
  - Error response: `503 Service Unavailable` (generic error), `401 Unauthorized` (Wrong username and/or password)

##

- GET `/api/sessions/current` 
  - Description: Check if an authenticated session exists
  - Request body: /
  - Response: `200 OK` 
  - Response body: Object that represents the user (Content-Type: application/json)
  ```
  {
    "id": 1,
    "username": "s1@polito.it",
    "name": "Utente s1"
  }
  ```
  - Error response: `503 Service Unavailable` (generic error), `401 Unauthorized` (Unauthenticated user)


##


- GET `/api/sessions/current` 
  - Description: Delete the current session if it exists
  - Request body: /
  - Response: `200 OK` 
  - Response body: /
  - Error response: `503 Service Unavailable` (generic error)


##


- GET `/api/courses` 
  - Description: Returns the list of courses with all their information
  - Request body: /
  - Response: `200 OK` 
  - Response body: 
    ```
    [
      {
        "code": "05BIDOV",
        "name": "Ingegneria del software",
        "cfu": 6,
        "preparatory": {
          "code": "02GOLOV",
          "name": "Architetture dei sistemi di elaborazione"
        },
        "maxStudents": null,
        "incompatibles": [
          {
            "code": "04GSPOV",
            "name": "Software engineering",
            "cfu": 6
          }
          ],
          "students": 0,
          "full": false
      },
      ...
    ]
    ```
  - Error response: `500 Internal Server Error` (generic error)

##

- GET `/api/studyPlan` 
  - Description: Returns the student plan information (including courses) of the user authenticated in session, if you have already created one
  - Request body: /
  - Response: `200 OK` 
  - Response body: 
  ```
  {
    "id": 5,
    "type": "PARTIME",
    "mincfu": 20,
    "maxcfu": 40,
    "courses": [
      {
        "code": "02GOLOV",
        "name": "Architetture dei sistemi di elaborazione",
        "cfu": 12
      },
      {
        "code": "03UEWOV",
        "name": "Challenge",
        "cfu": 5
      },
      {
        "code": "01URROV",
        "name": "Computational intelligence",
        "cfu": 6
      }
    ],
    "cfu": 23
  }
  ```
  - Error response: `500 Internal Server Error` (generic error), `404 Not Found` (user does not have a study plan)


##

- DELETE `/api/studyPlan` 
  - Description: Delete the authenticated session user’s study plan, if any
  - Request body: /
  - Response: `204 No Content` 
  - Response body: /
  - Error response: `500 Internal Server Error` (generic error)

##


- POST `/api/studyPlan` 
  - Description: Replaces the old study plan (if any) of the user authenticated in session and creates a new one, if the courses entered do not violate any constraint
  - Request body: 
  ```
  {
    "type": "PARTIME",
    "courses": ["02GOLOV", "07GOLOS"]
  }
  ```
  - Response: `201 Created` 
  - Response body: /
  - Error response: `500 Internal Server Error` (generic error), `422 Unprocessable Entity` (one or more study plan courses do not meet constraints)





## Database Tables

- Table `course` - is used to store the information of each course, such as code, name, cfu, its preparatory course, if it has it, and the limit of students, if it has it
- Table `incompatibleCourse` - contains pairs of incompatible courses
- Table `user` - contains users and their information such as id, email, name, password and salt
- Table `studyPlan` - contains the information of the study plans, that is id, type, the user to which it belongs and the minimum and maximum of credits according to the type of study plan
- Table `coursesStudyPlan` - table born from the many to many relationship between "course" and "studyPlan"; memorizes the courses assigned to each study plan

## Main React Components

- `StudyPlanApp` (in `StudyPlanApp/StudyPlanApp.js`): main component, defines the application routes and which components to render
- `LoginForm` (in `StudyPlanApp/Layout/Login.js`): contains the form to login
- `LoggedHomeLayout` (in `StudyPlanApp/Layout/Home.js`): component that builds the homepage of the logged in user, displaying on the left courses, and on the right information about the user in addition to the study plan, if any. It also has buttons to create, edit, save, or delete the plan
- `CourseList` (in `StudyPlanApp/Courses/CourseList.js`): contains the list of courses offered represented by the Courses/CourseRow component
- `CourseRow` (in `StudyPlanApp/Courses/CourseList.js`): represents a line that contains a course among those offered with all its information, error messages in case of violation of constraints and the button to add it to the study plan
- `StudyPlan` (in `StudyPlanApp/StudyPlan/StudyPlan.js`):  contains the list of courses added to the study plan represented by the StudyPlan/CourseRow component
- `CourseRow` (in `StudyPlanApp/StudyPlan/StudyPlan.js`): represents a line that contains a course added to the study plan and the button to remove it from the study plan
- `StudentInfo` (in `StudyPlanApp/StudyPlan/StudyPlan.js`): contains information about the user and the current study plan, such as cfu and type

## Screenshot

![Screenshot](./client/img/logged-home-edit.png)

## Users Credentials

- username: s1@polito.com, password: 1234, STUDY PLAN FULLTIME
- username: s2@polito.com, password: 1234, STUDY PLAN PARTIME
- username: s3@polito.com, password: 1234, STUDY PLAN PARTIME
- username: s4@polito.com, password: 1234, STUDY PLAN NON CREATO 
- username: s5@polito.com, password: 1234, STUDY PLAN NON CREATO

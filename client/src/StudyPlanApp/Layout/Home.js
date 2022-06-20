import { CourseList } from '../Courses/CourseList';
import '../../css.css'
import { StudyPlan, StudentInfo } from '../StudyPlan/StudyPlan';
import { Container, Row, Col, Button, Alert, Modal } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API from '../API';
import { InitialLoading } from './Layout'


function LoggedHomeLayout(props) {
    const [studyPlan, setStudyPlan] = useState({ type: "-", cfu: 0, mincfu: "-", maxcfu: "-", courses: [] });
    const [initialStudyPlanLoading, setInitialStudyPlanLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    function handleError(err) {
        props.setErrorMessage(err);
        navigate('/error');
    }

    useEffect(() => {
        if (initialStudyPlanLoading) {
            API.getStudyPlanInformation()
                .then((info) => {
                    if (info.type !== '-') {
                        // adding courses info
                        let updated_courses = [];

                        for (let i = 0; i < info.courses.length; i++) {
                            let new_c = props.courses.find((c) => c.code === info.courses[i].code);
                            updateCourseListInfoAdd(new_c);
                            updated_courses.push(new_c);
                        }

                        setStudyPlan(() => { return Object.assign({}, info, { courses: updated_courses }) });
                    } else
                        setStudyPlan(info); // empty study plan
                    setInitialStudyPlanLoading(false);
                    props.setErrorMessage([]);
                })
                .catch(err => handleError(err))
        }
    }, [initialStudyPlanLoading])

    function updateCourseListInfoAdd(courseToBeAdd) {
        props.setCourses(courses => courses.map(c => {
            if (c.code === courseToBeAdd.code)
                c.added = true;

            if (courseToBeAdd.preparatory.code && courseToBeAdd.preparatory.code === c.code)
                c.prep = true;

            if (courseToBeAdd.incompatibles.map((c) => c.code).includes(c.code))
                c.incompatible = true;

            return c;
        }))
    }

    return (
        <>
            <Container fluid>
                <Row>

                    { /* Left content */}
                    <Col className="col-6 mt-3 mx-0 px-0">
                        <CourseList
                            courses={props.courses}
                            setCourses={props.setCourses}
                            studyPlan={studyPlan}
                            setStudyPlan={setStudyPlan}
                            updateCourseListInfoAdd={updateCourseListInfoAdd}>
                        </CourseList>
                    </Col>

                    { /* Right content */}
                    <Col className='col-6 mt-3 customCol'>
                        <Container>
                            <Row>
                                <StudentInfo studyPlan={studyPlan}></StudentInfo>
                            </Row>
                            <hr></hr>

                            <Row className='mt-1'>
                                <Container fluid>
                                    <Row>

                                        {/* Button to create a study plan; disabled if study plan already exists */}
                                        <Col className='md-auto text-center'>
                                            <Link className={studyPlan.type !== '-' ? 'disabled-link' : ''} to="/logged-home/edit">
                                                <Button disabled={studyPlan.type !== '-'} variant='warning'>Create your study plan</Button>
                                            </Link>
                                        </Col>

                                        {/* Button to modify study plan; disabled if study plan doesn't exists */}
                                        <Col className='md-auto text-center'>
                                            <Link className={studyPlan.type === '-' || location.pathname === '/logged-home/edit' ? 'disabled-link' : ''} to="/logged-home/edit">
                                                <Button disabled={studyPlan.type === '-' || location.pathname === '/logged-home/edit'} variant='warning'>Modify your study plan</Button>
                                            </Link>
                                        </Col>

                                        {/* Button to delete study plan */}
                                        <Col className='md-auto text-center'>
                                            <DeleteButton />
                                        </Col>

                                    </Row>
                                </Container>
                            </Row>

                            {/* Button to choose study plan type when it is created */}
                            <Row className='mt-3'>
                                {location.pathname === '/logged-home/edit' && studyPlan.type === '-' ?
                                    <div className="btn-group btn-group-toggle">
                                        <div
                                            className={`btn btn-outline-warning ${studyPlan.type === 'FULLTIME' ? "type" : ""}`}
                                            onClick={() => { setStudyPlan((s) => { return Object.assign({}, s, { type: 'FULLTIME', mincfu: 60, maxcfu: 80 }) }) }}>
                                            FULLTIME</div>
                                        <div
                                            className={`btn btn-outline-warning ${studyPlan.type === 'PARTIME' ? "type" : ""}`}
                                            onClick={() => { setStudyPlan((s) => { return Object.assign({}, s, { type: 'PARTIME', mincfu: 20, maxcfu: 40 }) }) }}>
                                            PARTIME</div>
                                    </div>
                                    : null
                                }
                            </Row>
                            <hr></hr>

                            {/* Load study plan if exists or a message */}
                            <Row>
                                {studyPlan.courses.length > 0 ?
                                    <>
                                        <h1 className='text-center title'>Your study plan</h1>
                                        {initialStudyPlanLoading ? <InitialLoading /> : <StudyPlan setStudyPlan={setStudyPlan} studyPlan={studyPlan} courses={props.courses} setCourses={props.setCourses}></StudyPlan>}
                                    </>
                                    : (
                                        location.pathname === '/logged-home' ? < Alert variant='warning'>You haven't created a study plan yet! </Alert> : null
                                    )
                                }
                            </Row>

                            {/* Error message */}
                            <Row>
                                {location.pathname === '/logged-home/edit' && errorMessage.length > 0 ? < Alert variant='danger' onClose={() => setErrorMessage([])} dismissible>
                                    <ul>
                                        {errorMessage.map((e, i) => <li key={i}>{e}</li>)}
                                    </ul>
                                </Alert> : null}
                            </Row>

                            {/* Buttons to save or cancel changes */}
                            {location.pathname === '/logged-home/edit' && studyPlan.type !== '-' ?
                                <Row>
                                    <Col className='md-auto text-center'>
                                        <SaveButton />
                                        {' '}
                                        <Button variant="warning" onClick={() => {
                                            props.setInitialCoursesLoading(true);
                                            setInitialStudyPlanLoading(true);
                                            setErrorMessage([]);
                                            navigate('/logged-home')
                                        }}>
                                            Cancel
                                        </Button>
                                    </Col>
                                </Row>
                                : null}
                        </Container>
                    </Col>

                </Row>
            </Container>
        </>
    );

    function saveStudyPlan() {
        setErrorMessage([]);
        API.saveStudyPlan(studyPlan)
            .then(() => {
                setInitialStudyPlanLoading(true);
                props.setInitialCoursesLoading(true);
                navigate('/logged-home');
            })
            .catch(err => {
                if (err.myError)
                    setErrorMessage(err.myError);
                else
                    handleError(err);
            });
    }

    function deleteStudyPlan() {
        setErrorMessage([]);
        API.deleteStudyPlan()
            .then(() => {
                setInitialStudyPlanLoading(true);
                props.setInitialCoursesLoading(true);
                navigate('/logged-home');
            })
            .catch(err => {
                handleError(err);
            });

    }

    function DeleteButton() {
        const [show, setShow] = useState(false);

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        return (
            <>
                <Button disabled={studyPlan.type === '-'} variant='warning' onClick={handleShow}>
                    Delete your study plan
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete study plan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to permanently delete your study plan?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-dark" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant='outline-warning' onClick={() => deleteStudyPlan()}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    function SaveButton() {
        const [show, setShow] = useState(false);

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        return (
            <>
                <Button variant='warning' onClick={handleShow}>
                    Save
                </Button>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Save your study plan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to save your study plan?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-dark" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant='outline-warning' onClick={() => saveStudyPlan()}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}


const HomeLayout = (props) => {

    return (
        <>
            <Container fluid>
                <Row>
                    <Col className="mt-3">
                        <CourseList courses={props.courses}></CourseList>
                    </Col>
                </Row>
            </Container>
        </>
    )
}


export { HomeLayout, LoggedHomeLayout }
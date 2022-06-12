import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Card, Accordion, Col, Container, Table, Row, Alert } from 'react-bootstrap';
import { PlusCircleFill, ExclamationCircleFill, CheckCircleFill, BookmarkPlusFill } from "react-bootstrap-icons";
import { useLocation } from 'react-router-dom';
import '../../css.css'

function CourseList(props) {

    return (
        <>
            <Container fluid className='no-pad-r'>
                <Row className='d-flex align-items-center'>
                    <Col>
                        <Container className="head mb-1">
                            <Container fluid>
                                <Row>
                                    <Col className="col-1 col-md-1"></Col>
                                    <Col className="col-2 col-md-2">Code</Col>
                                    <Col className="col-4 col-md-4">Name</Col>
                                    <Col className="col-2 col-md-2 text-center">CFU</Col>
                                    <Col className="col-2 col-md-2 text-center">Students</Col>
                                    <Col className="col-1 col-md-1 text-center">Max</Col>
                                </Row>
                            </Container>
                        </Container>
                    </Col>
                    <Col className='col-1 px-0 text-start'></Col>
                </Row>

                {props.courses.map((c) => <CourseRow course={c} studyPlan={props.studyPlan} setStudyPlan={props.setStudyPlan} updateCourseListInfoAdd={props.updateCourseListInfoAdd} key={c.code} />)}
            </Container>
        </>
    )

}

function CourseRow(props) {
    const location = useLocation();

    return (
        <>
            <Row className='d-flex align-items-center'>
                <Col>
                    <Card className="custom-card">
                        <Accordion>
                            <Accordion.Item eventKey={props.course.code}>
                                <Accordion.Header>
                                    <Container className="added" fluid>
                                        <Row>
                                            <Col className='col-1 col-md-1 '>
                                                {location.pathname === '/logged-home/edit' && props.course.incompatible ? <ExclamationCircleFill fill='red' /> : null}
                                                {location.pathname === '/logged-home/edit' && props.course.added ? <CheckCircleFill fill='green' /> : null}
                                                {location.pathname === '/logged-home/edit' && (props.course.preparatory.code !== null && !props.studyPlan.courses.some( e => e.code === props.course.preparatory.code)) ? <BookmarkPlusFill fill='blue' /> : null}
                                                {location.pathname === '/logged-home/edit' && props.course.full && !props.course.added ? <ExclamationCircleFill fill='red' /> : null}
                                            </Col>
                                            <Col className='col-2 col-md-2 code'>{props.course.code}</Col>
                                            <Col className='col-4 col-md-4 '>{props.course.name}</Col>
                                            <Col className='col-2 col-md-2 text-center'>{props.course.cfu}</Col>
                                            <Col className='col-2 col-md-2 text-center'>{props.course.students}</Col>
                                            <Col className='col-1 col-md-1 text-center'>{props.course.maxStudents ? props.course.maxStudents : "-"}</Col>
                                        </Row>
                                    </Container>
                                </Accordion.Header>
                                <Accordion.Body>
                                    {location.pathname === '/logged-home/edit' && props.course.incompatible ? <Alert variant='danger'>The course is incompatible with one of the following courses included in the study plan</Alert> : null}
                                    {location.pathname === '/logged-home/edit' && props.course.added ? <Alert variant='success'>Course already added</Alert> : null}
                                    {location.pathname === '/logged-home/edit' && (props.course.preparatory.code !== null && !props.studyPlan.courses.some( e => e.code === props.course.preparatory.code)) ? <Alert variant='primary'>To be able to insert the course you must first insert its preparatory course in the study plan</Alert> : null}
                                    {location.pathname === '/logged-home/edit' && props.course.full && !props.course.added ? <Alert variant='danger'>Course is full</Alert> : null}
                                    <Table>
                                        <thead>
                                            <tr>
                                                <th>Incompatible courses</th>
                                                <th>Preparative course</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    {props.course.preparatory.code ? props.course.preparatory.code+" "+props.course.preparatory.name : ""}
                                                </td>
                                            </tr>
                                            {props.course.incompatibles.map((c) => {
                                                return (
                                                    <tr key={c.code}>
                                                        <td>
                                                            {c.code + " " + c.name}
                                                        </td>
                                                    </tr>)
                                            })}

                                        </tbody>
                                    </Table>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Card>
                </Col>

                <Col className='col-1 px-0 text-start'>
                    { location.pathname === '/logged-home/edit' 
                    && !props.course.added 
                    && !props.course.incompatible
                    && !props.course.full 
                    && props.studyPlan.type !== '-'
                    && (props.course.preparatory.code === null || props.studyPlan.courses.some( e => e.code === props.course.preparatory.code))
                    ? 
                        <PlusCircleFill className='clickable' onClick={() => {addCourseToStudyPlan()}}></PlusCircleFill> : null}
                </Col>

            </Row>


        </>
    )

    function addCourseToStudyPlan() {
        props.updateCourseListInfoAdd(props.course);
        props.setStudyPlan((s) => { return Object.assign({}, s, { cfu: s.cfu + props.course.cfu, courses: [...(s.courses), props.course] }) });
    }
}

export { CourseList };

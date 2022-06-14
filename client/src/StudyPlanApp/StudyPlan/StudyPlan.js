import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Table, Row, Card, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { DashCircleFill, ExclamationCircleFill, BookmarkCheck } from "react-bootstrap-icons";
import '../../css.css'
import { UserContext } from '../UserContext';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';


function StudyPlan(props) {
    return (
        <Container>
            <Row>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr className='center'>
                            <th>Code</th>
                            <th>Name</th>
                            <th>CFU</th>
                            <th></th>
                        </tr>
                    </thead>

                    {props.studyPlan.courses.map((c) => <CourseRow course={c} setCourses={props.setCourses} setStudyPlan={props.setStudyPlan} studyPlan={props.studyPlan} key={c.code}></CourseRow>)}

                </Table>

            </Row>
        </Container>
    )
}

function CourseRow(props) {
    const location = useLocation();

    function removeCourse(code) {
        props.setCourses(courses => courses.map(c => {
            if (c.code === props.course.code)
                c.added = false;

            if (props.course.preparatory.code && props.course.preparatory.code === c.code)
                c.prep = false;

            if (props.course.incompatibles.map((c) => c.code).includes(c.code))
                c.incompatible = false;

            if (c.maxStudents){
                c.full = false;
            }

            return c;
        }))

        props.setStudyPlan((s) => { return Object.assign({}, s, { cfu: s.cfu - props.course.cfu, courses: props.studyPlan.courses.filter((c) => c.code !== code) }) });
    }

    return (
        <tbody>
            <tr className='center'>
                <td>{props.course.code}</td>
                <td>{props.course.name}</td>
                <td>{props.course.cfu}</td>
                {
                    location.pathname !== '/logged-home/edit' ? <td></td> : (
                        !props.studyPlan.courses.some(e => e.preparatory.code === props.course.code)
                        ? <td>{<DashCircleFill onClick={() => removeCourse(props.course.code)} className='clickable' />}</td>
                        : <td><Over></Over></td>
                    )
                }
            </tr>
        </tbody>
    )

}

function StudentInfo(props) {
    const user = useContext(UserContext);

    return (
        <>
            <Card>
                <ListGroup variant="flush">
                    <ListGroup.Item><span className='bold'>Name: </span>{user.name}</ListGroup.Item>
                    <ListGroup.Item><span className='bold'>Study Plan Type: </span>{props.studyPlan.type}</ListGroup.Item>
                    <ListGroup.Item><span className='bold'>Min-Max CFU: </span>{props.studyPlan.mincfu + "/" + props.studyPlan.maxcfu}</ListGroup.Item>
                    <ListGroup.Item>
                        {props.studyPlan.type === '-' ? null
                            : (props.studyPlan.cfu < props.studyPlan.mincfu || props.studyPlan.cfu > props.studyPlan.maxcfu ?
                                <ExclamationCircleFill className='mx-1' fill='red' /> : null
                            )
                        }
                        <span className='bold'>Total selected CFU: </span>{props.studyPlan.cfu}
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </>
    )
}

function Over() {
    return (
        <>
            <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="button-tooltip-2">The course is preparatory to another one selected in the study plan</Tooltip>}
            >
                {({ ref, ...triggerHandler }) => (
                    <BookmarkCheck {...triggerHandler} ref={ref} fill='blue' />
                )}
            </OverlayTrigger>
        </>
    )
}

export { StudyPlan, StudentInfo }
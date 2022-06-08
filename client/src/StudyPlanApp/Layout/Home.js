import { Container, Row, Col } from 'react-bootstrap';
import { CourseList } from '../Courses/CourseList';
import '../../css.css'

const HomeLayout = (props) => {
    
    return (
        <>
            <Container fluid>
                <Row>
                    <Col className="mt-3">
                        {/* <h1 className='text-center title'>Courses</h1>  */}
                        <CourseList courses={props.courses}></CourseList> 
                        
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export { HomeLayout }
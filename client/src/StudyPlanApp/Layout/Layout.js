import { Container, Col, Button, Alert, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundLayout = () => {
    return (
        <>
            <Container>
                <Col className='col-12 text-center  mt-5'>
                    <h2>This is not the route you are looking for!</h2>
                    <Link to="/">
                        <Button variant="warning">Homepage</Button>
                    </Link>
                </Col>
            </Container>
        </>
    );
}

const ErrorLayout = (props) => {
    return (
        <>
            <Container>
                <Col className='col-12 text-center  mt-5'>
                    <Alert variant='danger'>{"Error: " + props.message.message + ". Try again!"}</Alert>
                </Col>
            </Container>
        </>
    );
}

function InitialLoading() {
    return (
        <ProgressBar animated now={50} />
    );
}


export { NotFoundLayout, ErrorLayout, InitialLoading }
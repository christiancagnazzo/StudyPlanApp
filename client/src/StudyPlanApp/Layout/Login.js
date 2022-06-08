import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';

function LoginForm(props) {
    const [username, setUsername] = useState('s100100@polito.it');
    const [password, setPassword] = useState('1234');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };

        // SOME VALIDATION lato client, ADD MORE!!! TODOOOOOO
        let valid = true;
        if (username === '' || password === '')
            valid = false;

        if (valid) {
            props.login(credentials);
        }
        else {
            // show a better error message... TODOOOOO
            setErrorMessage('Error(s) in the form, please fix it.')
        }
    };

    return (
        <Container>
            <Row className='className="justify-content-md-center'>
                <Col xs lg="3"></Col>
                <Col className='text-center col-6 mt-3'>
                    <h2>Log-in to create or modify your study plan!</h2>
                    {props.message ? <Alert variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert> : false}

                    <Form className='mt-2'>
                        {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                        <Form.Group controlId='username'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                        </Form.Group>
                        <Form.Group controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                        </Form.Group>
                        <Button variant='warning' className='mt-4' onClick={handleSubmit}>Login</Button>
                    </Form>
                </Col>
                <Col xs lg="3"></Col>
            </Row>
        </Container>
    )
}

export { LoginForm };
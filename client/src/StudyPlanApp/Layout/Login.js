import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
var validator = require("email-validator");

function LoginForm(props) {
    const [username, setUsername] = useState('s1@polito.it');
    const [password, setPassword] = useState('1234');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };

        let valid = true;
        let msg = '';

        if (!username || username === '' || !validator.validate(username)) {
            valid = false;
            msg += 'Username must be a valid email!\r\n'
        }

        if (!password || password === '') {
            valid = false;
            msg += 'Password must be not empty!'
        }

        if (valid) {
            props.login(credentials);
        }
        else {
            setErrorMessage(msg);
        }
    };

    return (
        <Container>
            <Row className='justify-content-md-center'>
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
                        <Button variant='warning' type='submit' className='mt-4' onClick={handleSubmit}>Login</Button>
                    </Form>
                </Col>
                <Col xs lg="3"></Col>
            </Row>
        </Container>
    )
}

export { LoginForm };
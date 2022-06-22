import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import '../../css.css'

function NavB(props) {
    const user = useContext(UserContext);

    return (
        <Navbar bg="warning" >
            <Container>
                <Navbar.Brand href="/home">
                    <i className="bi bi-book-half"></i>{' '}
                    Study Plan
                </Navbar.Brand>
                <Nav.Link className="hm" href="/home">Home</Nav.Link>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    {user ?
                        <>
                            <Navbar.Text>
                                Signed in as: <u>{user.name}</u>
                            </Navbar.Text>
                            <Nav.Item>
                                <Button variant="dark" onClick={props.logout}>Logout</Button>
                            </Nav.Item>
                        </> :
                        <Link to="/login">
                            <Button variant="dark">Login</Button>
                        </Link>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}


export { NavB };
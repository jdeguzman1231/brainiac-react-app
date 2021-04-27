import React, { useContext, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag'
import { AuthContext } from '../context/auth'
import { useForm } from '../util/hooks';
import bg from '../images/bg.png'


function LoginPage(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const [valid, validate] = useState(false);
    const { handleChange, onSubmit, values } = useForm(loginUserCallback, {
        email: '',
        password: ''
    })
    const handleClose = () => validate(false);
    const handleShow = () => validate(true);

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(proxy, result) {
            console.log(result);
            context.login(result.data.login);
            props.history.push('/');
        },
        onError(err) {
            handleShow();
            console.log(values)
        },
        variables: {
            email: values.email,
            password: values.password
        }
    })

    function loginUserCallback() {
        loginUser()
    }


    return (
        <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 900, backgroundRepeat: "no-repeat", backgroundPosition: "50% 70%" }}>
            <div className="form-container" style={{paddingTop: 120}}>
                <h1>Welcome Back,</h1>
                <p>log in to continue</p>
                <Form onSubmit={onSubmit} noValidate>
                    <Form.Group controlId="email">
                        {/* <Form.Label>Email address</Form.Label> */}
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            onChange={handleChange}
                            name="email" />
                        {/* <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text> */}
                    </Form.Group>

                    <Form.Group controlId="password">
                        {/* <Form.Label>Password</Form.Label> */}
                        <Form.Control type="password"
                            placeholder="Password"
                            onChange={handleChange}
                            name="password" />
                    </Form.Group>
                    {/* <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group> */}
                    <Button variant="primary" type="submit" block>
                        Login
                </Button>
                    <p style={{ marginTop: '30px', textAlign: 'center' }}>Don't have an account? <a href="/signup">Sign up</a></p>
                </Form>
                <Button block variant='link'>
                    Forgot your password?
            </Button>
                <Modal show={valid} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Incorrect username or password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Forgot your password?
                </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleClose}> Forgot Password</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

const LOGIN_USER = gql`
    mutation login(
        $email: String!
        $password: String!
    ) {
        login(
            email: $email
            password: $password
        ) {
            username
            token
        }
     }
 `

export default LoginPage;
import React, { useContext, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag'
import { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth'
import bg from '../images/bg.png'

function SignUpPage(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    const { handleChange, onSubmit, values } = useForm(signupUser, {
        username: '',
        email: '',
        name: '',
        password: ''
    })

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, result) {
            context.login(result.data.createUser);
            props.history.push('/')
        },
        onError(err) {
            // setErrors(err.graphQLErrors[0].extensions.exception.errors)
            console.log(err)
        },
        variables: {
            username: values.username,
            email: values.email,
            name: values.name,
            password: values.password
        }
    })

    function signupUser() {
        addUser();
    }

    return (
        <div style={{ backgroundImage: `url(${bg})`, backgroundSize: "65%", backgroundRepeat: "no-repeat", backgroundPosition: "50% 70%"}}>
            <div className="form-container">
                <h1>Create an Account,</h1>
                <p>sign up to continue</p>
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

                    <Form.Group controlId="name">
                        {/* <Form.Label>Email address</Form.Label> */}
                        <Form.Control type="text"
                            placeholder="Name"
                            onChange={handleChange}
                            name="name" />
                        {/* <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text> */}
                    </Form.Group>

                    <Form.Group controlId="username">
                        {/* <Form.Label>Email address</Form.Label> */}
                        <Form.Control type="text"
                            placeholder="Username"
                            onChange={handleChange}
                            name="username" />
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
                        Sign Up
                </Button>
                    <p style={{ marginTop: '30px' }}>Already have an account? <a href="/login">Login</a></p>
                </Form>
            </div>

        </div>

    );
}

const REGISTER_USER = gql`
    mutation createUser(
        $username: String!
        $email: String!
        $name: String!
        $password: String!
    ) {
        createUser(
            username: $username
            email: $email
            name: $name
            password: $password
        ) {
            username
            email
            name
            token
        }
    }
`

export default SignUpPage;
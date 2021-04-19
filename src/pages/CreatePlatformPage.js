import React, {useContext} from 'react';
import PlatformCard from '../components/PlatformCard'
import {Form, Button} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { useForm } from '../util/hooks';
import gql from 'graphql-tag';
import { AuthContext } from "../context/auth";


function CreatePlatformPage(props) {
    const { user, logout } = useContext(AuthContext);
    console.log(user);
    return (
            <div>
                <div className="form-container">
                <h4>Create a New Platform</h4>
                <Form noValidate>
                <Form.Group controlId="platform">
                    <Form.Label>Platform Name</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Platform" 
                    name = "platformName"/>
                    <Form.Text className="text-muted">
                    Put the name of your new title
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                    as="textarea" 
                    rows={3}
                    type="text" 
                    name="description"/>
                    <Form.Text className="text-muted">
                    Put a description for you and other users to understand your platform
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
                </div>
            </div>
        );
    }
    

export default CreatePlatformPage;

const FETCH_USER_QUERY = gql`
    query($username: String!) {
        getUser(username: $username) 
        {
            username
            email
            name
            createdPlatforms
            playedPlatforms
            bookmarkedPlatforms
        }
    }
`

const EDIT_USER = gql`
    mutation saveChanges(
        $username: String!
        $name: String!
    ) {
        saveChanges(
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
import React from 'react';
import PlatformCard from '../components/PlatformCard'
import {Form, Button} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { useForm } from '../util/hooks';
import gql from 'graphql-tag';


function AccountSettingsPage(props) {

    var username = props.match.params.username
    console.log(useQuery(FETCH_USER_QUERY, {
        variables: {
            username: username
        }
    }));
    const {loading, data} = useQuery(FETCH_USER_QUERY, {
        variables: {
            username: username
        }
    });
    if (loading) {return "loading"}
    else {
        console.log(data);
        const user = data.getUser

    let userText
    if (!user) {
        userText = <p>Loading user...</p>
    } else {

        userText = (
            <p> User Found</p>
        )
    }
    return (
            <div>
                <div className="form-container">
                <h4>Account Settings</h4>
                <p>Personal Information</p>
                <Form noValidate>
                    <Form.Group controlId="email">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                        type="text" 
                        placeholder={user.name}
                        // onChange = {handleChange}
                        name = "name"/>
                    </Form.Group>

                    <Form.Group controlId="name">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text"  
                        placeholder={user.username}
                        // onChange = {handleChange}
                        name = "username"/>
                    </Form.Group>

                    <Form.Group controlId="name">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="text"  
                        value={user.email}
                        // onChange = {handleChange}
                        name = "email"/>
                    </Form.Group>

                    <Button>Change password</Button>
                    <p></p>
                    <Button variant="primary" type="submit">
                        Save changes
                    </Button>
                </Form>
            </div>
            </div>
        );
    }
    
}
    

export default AccountSettingsPage;

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
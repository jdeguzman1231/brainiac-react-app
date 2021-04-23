import React, {useContext, setState ,useState} from 'react';
import PlatformCard from '../components/PlatformCard'
import {Form, Button} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { useForm } from '../util/hooks';
import gql from 'graphql-tag';
import {FETCH_USER_QUERY} from '../graphql/queries';
import { AuthContext } from '../context/auth'
function AccountSettingsPage(props) {
    const context = useContext(AuthContext)
    var username = props.match.params.username
    console.log(useQuery(FETCH_USER_QUERY, {
        variables: {
            username: username
        },
    }));
    console.log(username)
    const {loading, data} = useQuery(FETCH_USER_QUERY, {
        variables: {
            username: username
        },
        fetchPolicy: 'cache-and-network'
    });
    const { handleChange, onSubmit, values } = useForm(update_user_settings, {
        name: '',
        username: '',
        email: ''
    }) 
    const [edit_user] = useMutation(EDIT_USER, {
        update(cache){
           console.log(cache)
            window.location.href = '/'
       
        },
        onError(err) {
            console.log(err)
        },
        variables:{
            name: values.name,
            username: values.username,
            email: values.email
        }
    })
    function update_user_settings(){
        console.log('callback')
        if(values.name == ''){
            values.name = context.user.name
        }
        if(values.username == ''){
            values.username = context.user.username
        }
        edit_user();
    }
    if (loading) {return "loading"}
    else {
        console.log(data);
        const user = data.getUser
        if(!user){
            const user = context.user
        }
        values.email = user.email
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
                <Form noValidate onSubmit={onSubmit}>
                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                        type="text" 
                        defaultValue={user.name}
                        onChange = {handleChange}
                        name = "name"/>
                    </Form.Group>

                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text"  
                        defaultValue={user.username}
                        onChange = {handleChange}
                        name = "username"/>
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control readOnly type="text"  
                        value={user.email}
                        onChange = {handleChange}
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



const EDIT_USER = gql`
    mutation SaveChanges(
        $username: String!
        $name: String!
        $email: String!
    ) {
        saveChanges(username: $username, email: $email, name: $name)

    }
`;
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
    const { handleChange, onSubmit, values} = useForm(createPlatform, {
        name: '',
        creatorName: user.username,
        description: ''
    })

    

    const [addPlatform, {loading}] = useMutation(CREATE_PLATFORM, {
        update(proxy, result) {
            props.history.push('/account/'+user.username)
        },
        onError(err) {
            // setErrors(err.graphQLErrors[0].extensions.exception.errors)
            console.log(values.name);
            console.log(values.creatorName);
            console.log(values.description);
            console.log(err)
        },
        variables: {
            name: values.name,
            creatorName: values.creatorName,
            description: values.description
        }
    })

    function createPlatform() {
        console.log(addPlatform);
        addPlatform();
    }
    return (
            <div>
                <div className="form-container">
                <h4>Create a New Platform</h4>
                <Form onSubmit = {onSubmit}noValidate>
                <Form.Group controlId="platform">
                    <Form.Label>Platform Name</Form.Label>
                    <Form.Control 
                    type="text" 
                    placeholder="Platform" 
                    name = "name"
                    onChange = {handleChange}/>
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
                    name="description"
                    onChange = {handleChange}/>
                    <Form.Text className="text-muted">
                    Put a description for you and other users to understand your platform
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Create Platform
                </Button>
            </Form>
                </div>
            </div>
        );
    }
    

export default CreatePlatformPage;

const CREATE_PLATFORM = gql`
    mutation createPlatform(
        $name: String!
        $creatorName: String!
        $description: String!
    ) {
        createPlatform(
            name: $name
            creatorName: $creatorName
            description: $description
        ) {
            name
            creatorName
            description
        }
    }
`
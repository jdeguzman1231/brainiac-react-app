import React, {useContext, useState} from 'react';
import PlatformCard from '../components/PlatformCard'
import {Form, Button, ToggleButtonGroup, ToggleButton, Row, Container} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { useForm } from '../util/hooks';
import gql from 'graphql-tag';
import { AuthContext } from "../context/auth";
import {CREATE_PLATFORM} from "../graphql/mutations"
import {tagnames} from '../graphql/queries'
function CreatePlatformPage(props) {
    const[tags, setTags] = useState([])
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
            description: values.description,
            tags: tags
        }
    })
    
    const addTag = (e) =>{
        
        if(e.target.value != undefined){
            console.log(e.target.value)
            var selected = tagnames[e.target.value]
            console.log(selected)
            if(tags.includes(selected) == true){
                console.log(tags.indexOf(selected))
                const index = tags.indexOf(selected)
                tags.splice(index, 1)
            }
            else{
                tags.push(selected)
            }
            console.log(tags)
        }
    }
    function createPlatform() {
        console.log(addPlatform);
        addPlatform();
    }
    var items = []
    var items2 = []
    var rowlen = Math.floor(tagnames.length / 2)
    for(var i = 0; i < rowlen; i++){
        items.push(
            <ToggleButton onClick = {addTag} style = {{whiteSpace:'nowrap', justifyContent: 'center'}} value = {i} variant = 'outline-primary'>{tagnames[i]}</ToggleButton>
        )
    }
    for(var i = rowlen; i < tagnames.length; i++){
        items2.push(
            <ToggleButton onClick = {addTag} style = {{whiteSpace:'nowrap', justifyContent: 'center'}}value = {i} variant = 'outline-primary'>{tagnames[i]}</ToggleButton>
        )
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
                <Form.Label>Tags</Form.Label>
                <Container fluid style = {{marginBottom: '30px'}}>
                <Row>
                <ToggleButtonGroup type = 'checkbox'>
                    {items}
                </ToggleButtonGroup>
                </Row>
                <Row>
                <ToggleButtonGroup type = 'checkbox'>
                    {items2}
                </ToggleButtonGroup>
                </Row>
                </Container>
                <Button variant="primary" type="submit">
                    Create Platform
                </Button>
            </Form>
                </div>
            </div>
        );
    }
    

export default CreatePlatformPage;

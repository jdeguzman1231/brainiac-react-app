import React, {useContext, useState} from 'react';
import gql from 'graphql-tag';
import {Container, Col, Row, FormGroup, Form, Button} from 'react-bootstrap';
import {useMutation, useQuery} from '@apollo/client';
import  { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth'



function PlatformSettingsPage(props){
    const context = useContext(AuthContext);
    //const pplatformID = props.match.params.platformID;
    //var platformID = parseInt(pplatformID, 10);
    //const { loading, data: pdata } = useQuery(FETCH_PLATFORM_QUERY, {
        //variables: { platformID: platformID },
    //});
    const { handleChange, onSubmit, values } = useForm(update_platform_info, {
        name: '',
        description: '',
        private: true
    }) 
    const [ errors, setErrors ] = useState({});
    const [updatePlatform,{loading}] = useMutation(EDIT_PLATFORM, {
        update(proxy, result){
            context.login(result.data.updatePlatform);
            //return to platform page
        },
        onError(err){
            console.log(err);
        },
        variables:{
            name: values.name,
            description: values.description,
            private: values.private
        }

    })
    console.log("platform settings");
    function update_platform_info(){
        updatePlatform()
    }
    //if(loading){return loading}
    //else{
        //const platform = pdata.getPlatform
    return(
        <div>
            <h1 style={{textAlign:'center'}}>Platform Settings</h1>
            <Container>
                <Form>
                <Form.Group controlId = "new_name">
                        <Form.Label>Platform Name</Form.Label>
                        <Form.Control type = "text">
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId = "new_description">
                        <Form.Label>Platform Description</Form.Label>
                        <Form.Control as = "textarea" rows={3}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId = "privacy">
                        <Form.Label>Privacy</Form.Label>
                        <Form.Check id = "privSwitch"type="switch"></Form.Check>
                    </Form.Group>
                </Form>
                <Button type="submit" class="btn btn-primary">
                        Submit
                </Button>
            </Container>
        </div>
        );
    
}

const EDIT_PLATFORM = gql`
    mutation(
        $name: String!
        $description: String!
        $private: Boolean!
        ){
            editPlatform(
                name: $name
                description: $description
                private: $private
            )
        }
`
const FETCH_PLATFORM_QUERY = gql`
    query($platformID: Int!){
        getPlatform(platformID: $platformID){
            name
            creatorName
            description
            games
        }
    }  
`;


export default PlatformSettingsPage;
import React, {useContext, useState} from 'react';
import gql from 'graphql-tag';
import {Container, Col, Image, FormGroup, Form, Button} from 'react-bootstrap';
import {useMutation, useQuery} from '@apollo/client';
import  { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth'
import {EDIT_PLATFORM} from '../graphql/mutations';


function PlatformSettingsPage(props){
    const[current_photo, setPhoto] = useState('');
    const[fileobj, setFile] = useState(null) 
    const[load, setLoad] = useState(false)
    const context = useContext(AuthContext);
    const pplatformID = props.match.params.platformID;
    var platformID = parseInt(pplatformID, 10);
   // console.log(useQuery(FETCH_PLATFORM_QUERY, {
     //   variables: { platformID: platformID },
   //}))
   
    const {data: pdata } = useQuery(FETCH_PLATFORM_QUERY, {
         variables: { platformID: platformID }
    });
    const platform = pdata.getPlatform

    const returnurl = '/platform/' + pplatformID;
    const [ errors, setErrors ] = useState({});
    const { handleChange, onSubmit, values } = useForm(editPlatform, {
        name: '',
        description: '',
        private: true,
    }) 
 
    
    const [update_platform] = useMutation(EDIT_PLATFORM,{
        update(cache) {
            console.log(cache);
            cache.modify({
                fields:{
                    platforms(existingPlatforms = [], {readFIeld}){
                        const platform_ref = cache.writeFragment({
                            data:{
                                platformID: platformID,
                                creatorName: platform.creatorName,
                                name: values.name,
                                description: values.description,
                                private: values.private,
                                photo: current_photo
                            },
                            fragment: gql`
                                fragment platformFields on Platform{
                                    name
                                    description
                                    private
                                    photo
                                }
                            `
                        });
                        return [existingPlatforms, platform_ref];
                    }
                }
            })
            props.history.push(returnurl)
        },
        onError(err) {
            console.log(err)
        },
        variables: {
            platformID: platformID,
            creatorName: platform.creatorName,
            name: values.name,
            description: values.description,
            private: values.private,
            photo: current_photo
        }
    })

    const changePhoto = (e) =>{
        console.log(e.target.files[0])
        setFile(e.target.files[0])
    }

    async function upload_photo(){
        console.log(current_photo)
        const file = new FormData()
        console.log(fileobj)
        file.append('file', fileobj)
        file.append('upload_preset', 'brainiac_img')
        const res = await fetch('https://api.cloudinary.com/v1_1/dkgfsmwvg/image/upload',
            {
                method: 'POST',
                body: file
            }
        ).then(console.log('success'))
  
        const picfile = await res.json()
        const link = picfile.secure_url
        setPhoto(link)
        console.log('end')
    }
    
    function editPlatform(){
        console.log(current_photo)
        if(values.name == ''){
            values.name = platform.name
        }
        if(values.description == ''){
            values.description = platform.description
        }
        if(fileobj == null){
            console.log(current_photo)
            setPhoto(platform.photo)
            update_platform()

        }
        else{
            console.log(current_photo)
            upload_photo()

        }
        console.log(current_photo)
    }
    console.log(fileobj)
    console.log(current_photo)
    if(fileobj != null && current_photo != ''){
        update_platform()
    }
    if(load){
        return(
            <div>
                <h1 textAlign = 'center'>Loading...</h1>
            </div>
        )
    }
    return(
        <div>
            <h1 style={{textAlign:'center'}}>Platform Settings</h1>
            <h1 style={{textAlign:'center'}}>{platform.creatorName}'s platform</h1>
            <Container>
                <Form onSubmit={onSubmit}>
                <Form.Group controlId = "name">
                        <Form.Label>Platform Name</Form.Label>
                        <Form.Control name = "name" type = "text"  onChange = {handleChange} defaultValue = {platform.name}>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId = "description">
                        <Form.Label>Platform Description</Form.Label>
                        <Form.Control name = "description" as = "textarea" rows={3}  onChange = {handleChange} defaultValue={platform.description}>
                        </Form.Control>
                    </Form.Group>
                    {load ? (
                        <h2>Loading...</h2>
                    ) : (
                        <Form.Group controlId = 'photo'>
                            <Form.Label location = 'top'>Platform Cover Photo:</Form.Label>
                            <Form.File id = 'formcheck-api-regular'>
                                <Form.File.Label>Choose File</Form.File.Label>
                                <Form.File.Input onChange = {changePhoto}/>
                            </Form.File>
                        </Form.Group>
                        )}
                    <Form.Group controlId = "private">
                        <Form.Label>Privacy</Form.Label>
                        <Form.Check name = "private" id = "private"type="switch" defaultValue = {platform.private}></Form.Check>
                    </Form.Group>
                    <Button type="submit" class="btn btn-primary">
                        Submit
                    </Button>
                </Form>
            </Container>
        </div>
        );
    
}


const FETCH_PLATFORM_QUERY = gql`
    query($platformID: Int!){
        getPlatform(platformID: $platformID){
            name
            creatorName
            description
            games
            photo
        }
    }  
`;

export default PlatformSettingsPage;
import React, {useContext, useEffect, useState} from 'react';
import gql from 'graphql-tag';
import {Container, Row, ToggleButtonGroup, ToggleButton, Form, Button} from 'react-bootstrap';
import {useMutation, useQuery} from '@apollo/client';
import  { useForm } from '../util/hooks';
import { AuthContext } from '../context/auth'
import {EDIT_PLATFORM} from '../graphql/mutations';
import {tagnames, FETCH_PLATFORM_QUERY} from '../graphql/queries'

function PlatformSettingsPage(props){
    const[tags, setTags] = useState([])
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
    useEffect(() =>{
        if(tags.length == 0){
            setTags(platform.tags)
        }
    }, [])
    const [ errors, setErrors ] = useState({});
    const { handleChange, onSubmit, values } = useForm(a, {
        name: '',
        description: '',
        private: true,
    }) 
 
    const [update_platform] = useMutation(EDIT_PLATFORM,{
        update(cache){
            console.log(cache)
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
            photo: current_photo,
            tags: tags
        }
    })
    
    const addTag = (e) => {
        if(e.target.value != undefined){
            console.log(tags)
            var selected = tagnames[e.target.value]
            var newarray = []
            if(tags.includes(selected) == true){
                console.log(selected)
                newarray = tags.filter(tag => tag != selected)
                setTags(newarray)
            }
            else{
               if(tags.length == 0){
                   newarray = [selected]
                   setTags(newarray)
               }
               else{
                    tags.forEach(x => newarray.push(x))
                    newarray.push(selected)
                    setTags(newarray)
               }
                
            }

            console.log(tags)
        }
        
    }
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
        setLoad(true)
        const res = await fetch('https://api.cloudinary.com/v1_1/dkgfsmwvg/image/upload',
            {
                method: 'POST',
                body: file
            }
        ).then(console.log('success'))
  
        const picfile = await res.json()
        const link = picfile.secure_url
        console.log(link)
        setPhoto(link)
        console.log('end')
        update_platform({variables: {
            platformID: platformID,
            creatorName: platform.creatorName,
            name: values.name,
            description: values.description,
            private: values.private,
            photo: link,
            tags: tags
        }})
    }
    function a(){}
   const editPlatform = () => {
        console.log(current_photo)
        console.log('callback')
        console.log('name: ' + values.name);
        console.log('description:' + values.description);
        if(values.name === ''){
            values.name = platform.name
            console.log(platform.name)
        }
        if(values.description === ''){
            values.description = platform.description
            console.log(platform.description)
        }
        console.log('final value: ')
        console.log(values)
        console.log(current_photo)
        if(fileobj == null){
            update_platform({variables: {
                platformID: platformID,
                creatorName: platform.creatorName,
                name: values.name,
                description: values.description,
                private: values.private,
                photo: platform.photo,
                tags: tags
            }})
        }
        else{
            upload_photo()
        }
    }
   
    if(load){
        return(
            <div>
                <h1 textAlign = 'center'>Loading...</h1>
            </div>
        )
    }else{
    var defaults = []
    for(var i = 0; i < platform.tags.length; i++){
        var tag = platform.tags[i]
        if(tagnames.includes(tag) == true){
            var index = tagnames.indexOf(tag)
            defaults.push(index)
        }
    }
 
    console.log(platform.tags)
    console.log(tags)
    //if(tags.length != platform.tags.length){
      //  setTags(platform.tags)
   // }
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
    return(
        <div>
            <h1 style={{textAlign:'center'}}>Platform Settings</h1>
            <h1 style={{textAlign:'center'}}>{platform.creatorName}'s platform</h1>
            <Container>
                <Form >
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
                    <Form.Label>Tags</Form.Label>
                    <Container fluid style = {{marginBottom: '30px'}}>
                        <Row>
                        <ToggleButtonGroup defaultValue = {defaults} type = 'checkbox'>
                            {items}
                        </ToggleButtonGroup>
                        </Row>
                        <Row>
                        <ToggleButtonGroup defaultValue = {defaults} type = 'checkbox'>
                            {items2}
                        </ToggleButtonGroup>
                        </Row>
                    </Container>
                    <Button onClick = {editPlatform} class="btn btn-primary">
                        Submit
                    </Button>
                </Form>
            </Container>
        </div>
        );
    }
}




export default PlatformSettingsPage;
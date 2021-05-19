import React, {useContext, useEffect ,useState} from 'react';
import PlatformCard from '../components/PlatformCard'
import {Jumbotron, Form, Button, Image, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { useForm } from '../util/hooks';
import gql from 'graphql-tag';
import {FETCH_USER_QUERY} from '../graphql/queries';
import { AuthContext } from '../context/auth'
import {run as runHolder} from 'holderjs/holder'
import icon from '../images/brainiac-icon.png';
import {EDIT_USER} from '../graphql/mutations'
function AccountSettingsPage(props) {
    const [pfp, setpfp] = useState("holder.js/200x200?theme=sky&text=\n");
    const [newname, setName] = useState('');
    const [newusername, setUN] = useState('');
    const [load, setLoad] = useState(false)

    useEffect(() => {
           
        runHolder('temp')
    })

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
    const { handleChange, onSubmit, values } = useForm(a, {
        name: newname,
        username: newusername,
        email: ''
    }) 
    const [edit_user] = useMutation(EDIT_USER, {
        update(cache){
           console.log(cache)
            window.location.href = '/account/' + username
       
        },
        onError(err) {
            console.log(err)
        },
        variables:{
            name: newname,
            username: newusername,
            email: values.email,
            profilePicture: values.profilePicture
        }
    })
    function a(){}
    const update_user_settings = () =>{
        console.log('callback')
        console.log('username:' + values.username);
        console.log('name: ' + values.name);
        if(values.name === ''){
            values.name = context.user.name
        }
        if(values.username === ''){
            values.username = context.user.username
        }
        if(pfp == "holder.js/200x200?theme=sky&text=\n"){
            values.profilePicture = ''
        }
        if(pfp != "holder.js/200x200?theme=sky&text=\n"){
            values.profilePicture = pfp
        }
        setName(values.name);
        setUN(values.username);
        console.log('username:' + values.username);
        console.log('name: ' + values.name);
        edit_user();
    }
    const changepfp = async e =>{
        console.log(e.target.files[0])
        const pic = new FormData()
        pic.append('file', e.target.files[0])
        pic.append('upload_preset', 'brainiac_img')
        setLoad(true)
        const res = await fetch('https://api.cloudinary.com/v1_1/dkgfsmwvg/image/upload',
            {
                method: 'POST',
                body: pic
            }
        )
        const picfile = await res.json()
        console.log(picfile.secure_url)
        setpfp(picfile.secure_url);
        setLoad(false)
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
    if(user.profilePicture != "" && pfp == "holder.js/200x200?theme=sky&text=\n"){
        setpfp(user.profilePicture)
    }
    return (
            <div>
                <div className="page-container" style={{paddingTop:"4%", width: "60%", paddingBottom:"5%"}}>
                <h2>Account Settings</h2>
                <p>Personal Information</p>
                <Form noValidate style={{width:"50%", marginLeft:"25%"}}>
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
                    <Form.Group>
                        <Form.Label location='top'>Profile Picture</Form.Label>
                        {load ? (
                            <h2>Loading...</h2>
                        ): (<Image fluid src = {pfp} style={{marginLeft:"5%",width:"50%"}} roundedCircle></Image>)}
                        <Form.File id = "formcheck-api-regular">
                            <Form.File.Label>Choose file</Form.File.Label>
                            <Form.File.Input onChange = {changepfp}/>
                        </Form.File>
                    </Form.Group>
                    <OverlayTrigger
                        placement="bottom"
                        overlay={
                            <Tooltip>
                                Double Click to save your changes!
                        </Tooltip>
                        }>
                        <Button variant="primary" onClick = {update_user_settings}>
                            Save Changes
                        </Button>
                    </OverlayTrigger>
                    
                </Form>
            </div>
            <Jumbotron style={{ background: '#FCFBFB' }}>
                <img width={20}
                    height={20} src={icon}></img> Brainiac
                <div style={{fontSize:'70%', paddingLeft:".5%", display:"inline-block"}}>© 2021</div>
            </Jumbotron>
            </div>
        );
    }
    
}
    

export default AccountSettingsPage;




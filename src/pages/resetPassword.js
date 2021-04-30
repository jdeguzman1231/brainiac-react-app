import React, { useContext, useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag'
import { useForm } from '../util/hooks';
import {FETCH_USERS_QUERY} from '../graphql/queries'
import bg from '../images/bg.png'
import emailjs from 'emailjs-com'
import {cred} from '../context/emailer'
import{ init } from 'emailjs-com';
import RecentlyPlayed from './RecentlyPlayed';

function ResetPassword(props){
    const [reply, setReply] = useState({show: false, msg: ''});
    const {loading, data } = useQuery(FETCH_USERS_QUERY);
    const { handleChange, onSubmit, values } = useForm(a, {
        email: '',
    })
    init(cred.USER_ID);
    console.log(cred.USER_ID);
    function a(){};
    const handleReset = () => {
        var users = data.getUsers;
        const user = users.find(({email}) => email === values.email);
        if(!user){
            setReply({show:true, msg: 'That username is not registered!'})
        }
        const url = `http://localhost:3000/resetPassword/${user.email}`;
        let emailForm = {
            to: user.email,
            subject: 'Reset Password',
            html: `<a href = ${url}>${url}</a>`
        }
        emailjs.send(cred.SERVICE_ID, cred.TEMPLATE_ID, emailForm).then(function (response) {
            console.log('SUCCESS!', response.status, response.text);},function (error){console.log('ERROR...', error)})
        setReply({show:true, msg: 'Check your inbox for your reset password link'})
    }
    
    if(loading){return "loading"}
    else{
    return(
        <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 900, backgroundRepeat: "no-repeat", backgroundPosition: "50% 70%" }}>
        <div className="form-container" style={{paddingTop: 120}}>
            <h1>Enter the email address associated with your account.</h1>
            <h2>We'll send you an email with the reset link</h2>
            <Form onSubmit={onSubmit} noValidate>
                <Form.Group controlId="email">
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        name="email" />
                </Form.Group>

               
                <Button variant="primary" onClick = {handleReset}block>
                    submit
            </Button>
            <Modal show={reply.show} onHide={() =>{
                setReply({msg:reply.msg, show:false})
            }}>
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        {reply.msg}
                </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() =>{props.history.push('/')}}>Done</Button>
                    </Modal.Footer>
                </Modal>
            </Form>

        </div>
    </div>
    )
    }
}

export default ResetPassword;
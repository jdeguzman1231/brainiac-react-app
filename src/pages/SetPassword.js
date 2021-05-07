import React, { useContext, useState } from 'react';
import { Form, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag'
import { useForm } from '../util/hooks';
import {FETCH_USERS_QUERY} from '../graphql/queries'
import bg from '../images/bg.png';
import { propTypes } from 'react-bootstrap/esm/Image';



function SetPassword(props){
    const [showerr, setShow] = useState(false);
    const { handleChange, onSubmit, values } = useForm(verifypw, {
        password: '',
        confirmpassword: ''
    })
    function verifypw(){};
    const submitpw = (e) => {
        e.preventDefault();
        if(values.password === values.confirmpassword){
            console.log("true");
            props.history.push('/login');
        }
        else{
            setShow(true);

        }
    }
    const popover = (
        <Popover>
            <Popover.Title as = "h4">Invalid Entry</Popover.Title>
            <Popover.Content>
                Please make sure that confirm password matches your new password entry.
            </Popover.Content>
        </Popover>
    );
    return(
        <div style={{ backgroundImage: `url(${bg})`, backgroundSize: 900, backgroundRepeat: "no-repeat", backgroundPosition: "50% 70%" }}>
            <div className="form-container" style={{paddingTop: 120}}>
                <h1>Enter your new password:</h1>
                <Form onSubmit={onSubmit} noValidate>
                    <Form.Group controlId = 'password'>
                        <Form.Control
                            type = 'password'
                            placeholder="Password"
                            onChange={handleChange}
                            name="password"
                        />
                    </Form.Group>
                    <Form.Group controlId = 'confirmpassword'>
                        <Form.Control
                            type = 'password'
                            placeholder = 'Confirm Password'
                            onChange = {handleChange}
                            name = 'confirmpassword'
                        />
                    </Form.Group>
                    <OverlayTrigger  rootCloseEvent = 'click' show = {showerr} placement = 'bottom' overlay = {popover}>
                    <Button variant="primary" onClick ={submitpw} block>
                        submit
                    </Button>
                    </OverlayTrigger>

                </Form>
            </div>
        </div>
    )
}


export default SetPassword;
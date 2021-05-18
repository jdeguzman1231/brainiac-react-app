import React, {useContext, useEffect, useState} from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import {Row, Col, Container, Image, Button, Jumbotron, Modal, Form, Dropdown} from 'react-bootstrap';
import gql from 'graphql-tag';
import {run as runHolder} from 'holderjs/holder'
import AccountPlatformCard from '../components/AccountPlatformCard'
import AccountGameCard from '../components/AccountGameCard'
import { useForm } from '../util/hooks';
import { AuthContext } from "../context/auth";
import {FETCH_PLATFORM_QUERY, FETCH_USER_QUERY} from '../graphql/queries'
import {addTheme as add_theme} from 'holderjs/holder'
import Avatar from "react-avatar-edit"
function AccountPage(props) {
    const [pfp, setpfp] = useState("holder.js/100px165?text=\n")
    const [show, setShow] = useState(false)
    const [color, setColor] = useState("#d3d3d3")
    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);
    const { handleChange, onSubmit, values } = useForm(updateColorCallback, {
        email: '',
        color: ''
    }) 
    var username = props.match.params.username
    const {loading, data} = useQuery(FETCH_USER_QUERY, {
        variables: {
            username: username
        },
        fetchPolicy: 'cache-and-network'
    });
    useEffect(() => {
       //add_theme("theme1",{background: '#aecad6', backgroundImage: 'linear-gradient(315deg, #aecad6 0%, #b8d3fe 74%)'})
        runHolder('temp')
    })

    
    const { user, logout } = useContext(AuthContext);
    var email;
    if (user) {
        var loggedInUser = user.username;
        email = user.email;
    }
    else {
        var loggedInUser = '';
        email = '';
    }

    const [updateColor, {loading: load}] = useMutation(EDIT_COLOR, {
        update(cache) {
            console.log(cache)
            window.location.reload();
        },
        onError(err) {
            console.log(err.networkError.result.errors);
        },
        variables: {
            color: values.color,
            email: email
        }
    })
    
    function updateColorCallback() {
        updateColor()
        setShow(false);
    }

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
    if(user.profilePicture != "" && pfp == "holder.js/100px165?text=\n"){
        console.log(user.profilePicture)
        setpfp(user.profilePicture)
    }
    var display;
    var button;
    

    if (loggedInUser == username) {
        display = <Col xs = {8} style = {{marginTop: '120px'}}>
        <Row style = {{paddingBottom: '60px'}}>
            <Col>
            <p>Recently Played:</p>

            <Row style = {{paddingBottom: '10px'}}>
                {user.playedPlatforms.slice(0,3).map((gameID) => (
                <Col >
                    <AccountGameCard gameID={gameID} />
                </Col>
                ))}
            </Row>
            <Row>
                <Col style = {{paddingLeft: '90px'}}>
                    <Button variant = "outline-dark" size='lg' href='/playedplatforms'>View Recently Played Games</Button>
                </Col>
            </Row>
            </Col>
        </Row>
        <Row style = {{paddingBottom: '60px'}}>
            <Col>
            <p>Bookmarked:</p>

            <Row style = {{paddingBottom: '10px'}}>
                {user.bookmarkedPlatforms.slice(0,3).map((platformID) => (
                <Col >
                    <AccountPlatformCard platformID={platformID} />
                </Col>
                ))}
            </Row>
            <Row>
                <Col style = {{paddingLeft: '90px'}}>
                    <Button variant = "outline-dark" size='lg' href='/bookmarkedplatforms'>View Bookmarked Platforms</Button>
                </Col>
            </Row>
            </Col>
        </Row>
        <Row style = {{paddingBottom: '60px'}}>
            <Col>
            <p>Your platforms</p>

            <Row style = {{paddingBottom: '10px'}}>
                {user.createdPlatforms.slice(0,3).map((platformID) => (
                <Col >
                    <AccountPlatformCard platformID={platformID} />
                </Col>
                ))}
            </Row>
            <Row>
                <Col style = {{paddingLeft: '90px'}}>
                    <Button variant = "outline-dark" size='lg' href='/createplatform'>Create New Platform</Button>
                </Col>
                <Col>
                    <Button variant = "outline-dark" size='lg' href={`${username}/createdplatforms`}>View Your Platforms</Button>
                </Col>
            </Row>
            
            </Col>
        </Row>
    </Col>
        button = <Button variant= "outline-light" onClick = {handleOpen} style = {{float: "right"}}>Change Color</Button>
    }
    else {
        display = <Col xs = {8} style = {{marginTop: '120px'}}>
        <Row style = {{paddingBottom: '60px'}}>
            <Col>
            <p>@{username}'s platforms</p>

            <Row style = {{paddingBottom: '10px'}}>
                {user.createdPlatforms.slice(0,3).map((platformID) => (
                <Col >
                    <AccountPlatformCard platformID={platformID} />
                </Col>
                ))}
            </Row>
            <Row>
                <Col>
                    <Button variant = "outline-dark" size='lg' href={`${username}/createdplatforms`}>View @{username}'s Created Platforms</Button>
                </Col>
            </Row>
            
            </Col>
        </Row>
    </Col>
    }
    
    return (
        <div>
        <Jumbotron style ={{marginBottom: '-100px', background: user.color}}>
            {button}
        </Jumbotron>
        <Modal show = {show} onHide = {handleClose}>
            <Modal.Header>
                <Modal.Title>Add Activity</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Select a Color
                <Dropdown>
                    <Form onSubmit = {onSubmit}>
                    <Form.Group>
                        <Form.Control onChange={handleChange} as="select" name = "color">
                                <option>Choose Color</option>
                                <option value = "#f8c3b9">Red</option>
                                <option value = "#f6d3af">Orange</option>
                                <option value = "#fbeba5">Yellow</option>
                                <option value = "#b5efce">Green</option>
                                <option value = "#b7dcf4">Blue</option>
                                <option value = "#ddc6e7">Purple</option>
                                <option value = "#e8eaec">Gray</option>
                                <option value = "#ffd1dc">Pink</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit" block>
                            Change
                    </Button>
                    </Form>
                </Dropdown>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick = {handleClose}> Cancel </Button>
            </Modal.Footer>
        </Modal>

        <Container>
            <Row>
            <Col xs = {4}>
                <Row >
                    <Image fluid style = {{width: '250px' ,marginLeft: '30px'}} src = {pfp} roundedCircle/>
                </Row>
                <Row  style = {{marginTop: '15px', marginLeft: '80px'}}>
                    <h3>{user.name}</h3>
                </Row>
                <Row style = {{marginLeft: '50px'}}>
                    <Col xs = {6}><p>@{user.username}</p></Col>
                    <Col></Col>
                </Row>
            </Col>
            {display}
            </Row>
        </Container>

        </div>
    );
    }
}

export default AccountPage;

export const EDIT_COLOR = gql`
    mutation editColor(
        $email: String!
        $color: String
        ){
           editColor(
                email: $email
                color: $color
            )
        }
`;


import React, {useContext, useEffect, useState} from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import {Row, Col, Container, Image, Button, Jumbotron} from 'react-bootstrap';
import gql from 'graphql-tag';
import {run as runHolder} from 'holderjs/holder'
import AccountPlatformCard from '../components/AccountPlatformCard'
import AccountGameCard from '../components/AccountGameCard'
import { AuthContext } from "../context/auth";
import {FETCH_PLATFORM_QUERY, FETCH_USER_QUERY} from '../graphql/queries'
import {addTheme as add_theme} from 'holderjs/holder'
import Avatar from "react-avatar-edit"
function AccountPage(props) {
    const [pfp, setpfp] = useState("holder.js/100px165?text=\n")
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
    if (user) {
        var loggedInUser = user.username;
    }
    else {
        var loggedInUser = '';
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
        <Image style ={{marginBottom: '-100px'}} src = "holder.js/100px165?text=\n"></Image>

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

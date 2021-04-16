import React, {useContext} from 'react';
import { useQuery } from '@apollo/client';
import {Row, Col, Container, Image, Button} from 'react-bootstrap';
import gql from 'graphql-tag';

function AccountPage(props) {
    var username = props.match.params.username
    console.log(useQuery(FETCH_USER_QUERY, {
        variables: {
            username: username
        }
    }));
    const {loading, data} = useQuery(FETCH_USER_QUERY, {
        variables: {
            username: username
        }
    });
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
    return (
        <Container>
            <Row>
            <Col>
                <Row>
                    <Image src = "holder.js/300x200"roundedCircle/>
                </Row>
                <Row>
                    <h3>{user.name}</h3>
                </Row>
                <Row>
                    <Col xs = {6}><p>@{user.username}</p></Col>
                    <Col></Col>
                </Row>
            </Col>
            <Col xs = {10}>
                <Row>
                </Row>
                <Row>
                    <Col>
                    <p>Recently Played</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <p>Bookmarked</p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <p>Your platforms</p>
                    <Button variant = "outline-dark" size='lg'>+</Button>
                    </Col>
                </Row>
            </Col>
            </Row>
        </Container>
    );
    }
}

export default AccountPage;

const FETCH_USER_QUERY = gql`
    query($username: String!) {
        getUser(username: $username) 
        {
            username
            email
            name
            createdPlatforms
            playedPlatforms
            bookmarkedPlatforms
        }
    }
`
import React, {useContext} from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import {Row, Col, Container, Image, Button, Jumbotron} from 'react-bootstrap';
import AccountPlatformCard from '../components/AccountPlatformCard'
import gql from 'graphql-tag';
import { AuthContext } from "../context/auth";


function CreatedPlatforms(props) {
    var username = props.match.params.username
    console.log(username)
    const {loading, data} = useQuery(FETCH_USER_QUERY, {
        variables: {
            username: username
        },
        onError(err) {
            console.log(err.networkError.result.errors);
        },
    });

    if (loading) {return "loading"}
    else {
        console.log(data)
        const user = data.getUser
    return(
        <Container>
        <Jumbotron>
            <h3>@{username}'s Created Platforms</h3>
        </Jumbotron>
        <Row style = {{paddingBottom: '10px'}}>
                        {user.createdPlatforms.map((platformID) => (
                        <Col >
                            <AccountPlatformCard platformID={platformID} />
                        </Col>
                        ))}
                    </Row>
        </Container>
    );
    }
}

export default CreatedPlatforms;

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
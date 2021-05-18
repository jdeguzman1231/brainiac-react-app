import React, {useContext} from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import {Row, Col, Container, Image, Button, Jumbotron} from 'react-bootstrap';
import gql from 'graphql-tag';
import { AuthContext } from "../context/auth";
import AccountGameCard from '../components/AccountGameCard';


function RecentlyPlayed(props) {
    const { user, logout } = useContext(AuthContext);
    var username = user.username
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
        const recentList = user.playedPlatforms
        console.log(recentList)
    return(
        <Container>
        <Jumbotron>
            <h3>@{username}'s Played Games</h3>
        </Jumbotron>
        <Row style = {{paddingBottom: '10px'}}>
                        {user.playedPlatforms.map((gameID) => (
                        <Col >
                            <AccountGameCard gameID={gameID} />
                        </Col>
                        ))}
                    </Row>
        </Container>
    );
    }
}

export default RecentlyPlayed;

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
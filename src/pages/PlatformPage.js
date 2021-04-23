import React, {useState, useEffect, useContext} from 'react';
import gql from 'graphql-tag'
import {Router, Route} from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import { Container, Col, Row, Jumbotron, Button } from 'react-bootstrap'
import GameCard from '../components/GameCard'
import { AuthContext } from "../context/auth";

function PlatformPage(props) {
    const { user, logout } = useContext(AuthContext);
    console.log(user)
    const pplatformID = props.match.params.platformID;
    var platformID = parseInt(pplatformID, 10);
    const platformURL = '/platform/' + pplatformID;
    const { loading, data: pdata } = useQuery(FETCH_PLATFORM_QUERY, {
        variables: { platformID: platformID },
        fetchPolicy: 'cache-and-network'
    });

    
    const platform_settings = '/platform/' + pplatformID + '/settings';
    const toSettings = () =>{
        props.history.push()
    }
    const [bookmark] = useMutation(BOOKMARK_PLATFORM, {
        update(proxy, results) {
            props.history.push(platformURL)
        },
        onError(err) {
            console.log(err.networkError.result.errors);
        },
        variables: {
            username: user.username,
            platformID: platformID
        }
    })
    function bookmarkPlatform(){
        bookmark();
    }
    if (loading) { return "loading" }
    else {
        console.log(pdata)
        const platform = pdata.getPlatform
        console.log(platform_settings);
        return (
            <div className="page-container">
                <Jumbotron>
                    <Container>
                        <Row>
                            <Col>
                        <h1>{platform.name}</h1>
                        <br></br>
                        <p>{platform.description}</p>
                        <p>created by {platform.creatorName}</p>
                        </Col>
                        </Row>
                        <Row>
                        <Col>
                        <Button onClick = {toSettings} variant = 'secondary' style = {{marginLeft: '1000px', marginBottom: '10px'}}>
                        Settings
                        </Button>
                        <Button onClick = {bookmarkPlatform} variant = 'secondary' style = {{marginLeft: '1000px'}}>
                        Bookmark
                        </Button>
                        </Col>
                        </Row>
                    </Container>
                </Jumbotron>
                <h3>Games:</h3>
                <hr></hr>
                <Container>
                    <Row>{loading ? (<h1>Loading...</h1>) : (
                        platform.games && platform.games.map((gameID) => (
                            <Col >
                                <GameCard gameID={gameID} />
                            </Col>
                        ))
                    )}
                    </Row>
                </Container>
            </div>
        )
    }
}

const FETCH_PLATFORM_QUERY = gql`
    query($platformID: Int!){
        getPlatform(platformID: $platformID){
            name
            creatorName
            description
            games
        }
    }  
`;

const BOOKMARK_PLATFORM = gql`
    mutation bookmarkPlatform(
        $username: String!
        $platformID: Int!
    ) {
        bookmarkPlatform(
            username: $username
            platformID: $platformID
        )
    }
`;

export default PlatformPage;
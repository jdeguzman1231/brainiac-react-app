import React, {useState, useEffect} from 'react';
import gql from 'graphql-tag'
import {Router, Route} from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Container, Col, Row, Jumbotron, Button } from 'react-bootstrap'
import GameCard from '../components/GameCard'

function PlatformPage(props) {
    const pplatformID = props.match.params.platformID;
    var platformID = parseInt(pplatformID, 10);
    const { loading, data: pdata } = useQuery(FETCH_PLATFORM_QUERY, {
        variables: { platformID: platformID },
        fetchPolicy: 'cache-and-network'
    });

    
    const platform_settings = '/platform/' + pplatformID + '/settings';
    const toSettings = () =>{
        props.history.push(platform_settings)
    }
    if (loading) { return "loading" }
    else {
        console.log(pdata)
        const platform = pdata.getPlatform
        console.log(platform_settings);
        return (
            <div className="page-container">
                <Jumbotron>
                    <h1>{platform.name}</h1>
                    <br></br>
                    <p>{platform.description}</p>
                    <p>created by {platform.creatorName}</p>
                </Jumbotron>
                <Button onClick = {toSettings} variant = 'secondary'>
                    Settings
                </Button>
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

export default PlatformPage;
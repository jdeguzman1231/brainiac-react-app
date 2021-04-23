import React, {useState, useEffect} from 'react';
import gql from 'graphql-tag'
import {Router, Route} from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { Container, Col, Row, Jumbotron, Button } from 'react-bootstrap'
import GameCard from '../components/GameCard'
import { AuthContext } from "../context/auth";
import { useContext, useForm } from "react";

function PlatformPage(props) {
    function refresh(){
        window.location.reload();
    }
    const pplatformID = props.match.params.platformID;
    var platformID = parseInt(pplatformID, 10);
    const parentPlatform = platformID;                                                       
    
    const { loading, data: pdata } = useQuery(FETCH_PLATFORM_QUERY, {
        variables: { platformID: platformID },
        fetchPolicy: 'cache-and-network'
    });

    
    const platform_settings = '/platform/' + pplatformID + '/settings';
    const toSettings = () =>{
        props.history.push(platform_settings)
    }

    const { user, logout } = useContext(AuthContext);
    if(user){
        var creatorName = user.username;
    }
    else{
        var creatorname = '' ; 
    }
    const [addGame, { loading: load, data: dataa }] = useMutation(CREATE_GAME,{
       
        update(cache,{ data: {addGame}}){
            cache.modify({
                fields:{
                    games(existingGames = []){
                        const newGameref= cache.writeFragment({
                            data: addGame,
                            fragment: gql`
                                fragment NewGame on Game{
                                    creatorName
                                    parentPlatform
                                }
                            `
                        });
                        return [...existingGames, newGameref];
                    }
                }
            })
        }
      });

   
    if (loading) { return "loading" }
    else {
        console.log(pdata)
        const platform = pdata.getPlatform
        console.log(platform_settings);
        if(user && user.username == platform.creatorName ){
            return (
                <div className="page-container">
                    <Jumbotron>
                        <h1>{platform.name}</h1>
                        <br></br>
                        <p>{platform.description}</p>
                        <p>created by {platform.creatorName}</p>
                        <Button onClick = {toSettings} variant = 'secondary'>
                        Settings
                    </Button>
                    </Jumbotron>
                    
                    <h3>Games:</h3>
                    <Button onClick={e => {
                        e.preventDefault();
                        addGame({ variables: { creatorName: creatorName, parentPlatform: parentPlatform} });refresh();
                        }}>Add Game
                    </Button>
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
        else{
            return (
                <div className="page-container">
                    <Jumbotron>
                        <h1>{platform.name}</h1>
                        <br></br>
                        <p>{platform.description}</p>
                        <p>created by {platform.creatorName}</p>
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

const CREATE_GAME= gql`
    mutation createGame(
        $creatorName: String!
        $parentPlatform: Int!
    ) {
        createGame(
            creatorName: $creatorName
            parentPlatform: $parentPlatform
        ) {
            creatorName
            parentPlatform
        }
    }
`

export default PlatformPage;
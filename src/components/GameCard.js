import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { run as runHolder } from 'holderjs/holder'
import { Link } from 'react-router-dom'
import {randcolor} from '../graphql/queries'
function GameCard(id) {
    var ind = Math.floor(Math.random() * 5)
    var img = randcolor[ind]
    const gameID = parseInt(id['gameID'], 10);
    console.log(gameID)
    const { loading, data, error } = useQuery(FETCH_GAME_QUERY, {
        variables: { gameID, gameID },
    });
    useEffect(() => {
        runHolder('layoutimg')
    }, [])
    if (loading) { return "loading" }
    else {
        var game
        if(data){
            game = data.getGame
        }
    

        if (game == null) { return null; }
        const parentPlatform = game.parentPlatform
        console.log(img)
        if(game){
            if(game.pictures.length == 0){
                img = randcolor[ind]
            }
            console.log('game pictures '+ game.pictures)
            if(game.pictures.length > 0 && game.pictures[0] != img){
                img = game.pictures[0]
            }
        }

      

       
        console.log(img)
        console.log(game.name + ' ' + game.pictures)
        return (
            <div class="pagecard">
                <Card style={{ width: '15rem' }}>
                    <Card.Img className='layoutimg' variant="top" src={img} thumbnail />
                    <Card.Body>
                        <Card.Title>{game.name}</Card.Title>
                        <Link to={`/platform/${parentPlatform}/game/${gameID}`}>play</Link>
                        <Card.Text>
                            created by {game.creatorName}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

const FETCH_GAME_QUERY = gql`
    query($gameID: Int!){
        getGame(gameID: $gameID){
            name
            creatorName
            description
            parentPlatform
            pictures
        }
    } 
`;

export default GameCard;
import React from 'react';
import { Card } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

function GameCard(id) {
    const gameID = parseInt(id['gameID'], 10);
    console.log(gameID)
    const { loading, data } = useQuery(FETCH_GAME_QUERY, {
        variables: { gameID, gameID },
    });
    if (loading) { return "loading" }
    else {
        console.log(data)
        const game = data.getGame
        return (
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                    <Card.Title>{game.name}</Card.Title>
                    <Link to={`/game/${gameID}`}>play</Link>
                    <Card.Text>
                        created by {game.creatorName}
                    </Card.Text>
                </Card.Body>
            </Card>
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
        }
    } 
`;

export default GameCard;
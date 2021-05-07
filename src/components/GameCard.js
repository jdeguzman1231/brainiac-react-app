import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { run as runHolder } from 'holderjs/holder'
import { Link } from 'react-router-dom'

function GameCard(id) {
    const gameID = parseInt(id['gameID'], 10);
    console.log(gameID)
    const { loading, data, error } = useQuery(FETCH_GAME_QUERY, {
        variables: { gameID, gameID },
    });
    useEffect(() => {
        runHolder('layoutimg')
    })
    if (loading) { return "loading" }
    else {
        console.log(data)
        const game = data.getGame
        if (game == null) { return null; }
        const parentPlatform = game.parentPlatform
        return (
            <div class="pagecard">
                <Card style={{ width: '15rem' }}>
                    <Card.Img className='layoutimg' variant="top" src="holder.js/100px180?random=yes" thumbnail />
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
        }
    } 
`;

export default GameCard;
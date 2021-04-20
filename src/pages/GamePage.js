import React from 'react';
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

function GamePage(props) {
    const ggameID = props.match.params.gameID;
    const gameID = parseInt(ggameID, 10);
    const { loading, data } = useQuery(FETCH_GAME_QUERY, {
        variables: { gameID, gameID },
    });
    if (loading) { return "loading" }
    else {
        console.log(data)
        const game = data.getGame
        return (
            <div className="game-page-container">
                <img
                    className="d-block w-100"
                    src="holder.js/800x400?text=Second slide&bg=282c34"
                />
                <h2>{game.name}</h2>
                <p>by {game.creatorName}</p>
                <hr></hr>
                <p>{game.description}</p>
                <p>Tags:</p> 
                <p>{game.tags}</p>
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
            tags
        }
    }
`;

export default GamePage;
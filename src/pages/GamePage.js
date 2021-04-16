import React from 'react';
import gql from 'graphql-tag'
import {useQuery} from '@apollo/client'

function GamePage(props){
    const ggameID=props.match.params.gameID;
    const gameID = parseInt (ggameID, 10);
    const { loading, data} = useQuery(FETCH_GAME_QUERY, {
        variables: {gameID, gameID},
    });
    if (loading) {return "loading"}
    else{
        console.log(data)
        const game = data.getGame
        return(
            <div>
                <h1>{game.name}</h1>
                <h3>{game.description}</h3>
                <h3>by {game.creatorName}</h3>
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

export default GamePage;
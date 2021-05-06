import React from 'react';
import ActivityCard from './../components/ActivityCard';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import {Container, Row, Col, Button} from "react-bootstrap";
function DesignPage(props) {
    const ggameID = props.match.params.gameID;
    const gameID = parseInt(ggameID, 10);
    const { loading, data } = useQuery(FETCH_GAME_QUERY, {
        variables: { gameID, gameID },
        fetchPolicy: 'cache-and-network'
    });

    if (loading) {
        return "loading..."
    }
    else{
        const game = data.getGame;
        return(
            <Container>
                <p>You are currently working on...</p>
                <h2>{game.name}</h2>
                <h4>Activities</h4>
                <Container>
                        <Row style = {{paddingBottom: '10px'}}>
                            {loading ? (<h1>Loading...</h1>) : (
                            game.activities && game.activities.map((activityID) => (
                                <Col >
                                    <ActivityCard activityID={activityID} />
                                </Col>
                            ))
                        )}
                        </Row>
                        <Row>
                           <Button style = {{left: '50%'}}>Add New Activity</Button>
                        </Row>
                </Container>
                
            </Container>
        )
    }
}

export default DesignPage;

const FETCH_GAME_QUERY = gql`
    query($gameID: Int!){
        getGame(gameID: $gameID){
            name
            creatorName
            description
            parentPlatform
            tags
            activities
        }
    }
`;
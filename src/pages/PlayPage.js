import React from 'react';
import {ActivityCard} from './../components/ActivityCard';
import {QuestionCard} from './../components/QuestionCard';
import {ActivityList} from './../components/ActivityList';
import {QuestionList} from './../components/QuestionList';
import MultipleChoiceActivity from './../components/MultipleChoiceActivity';
import { useQuery, useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag'
import {Container, Jumbotron, Button, Row, Col} from "react-bootstrap";

function PlayPage(props) {
    var currentActivity = 0;

    function nextActivity(){
        currentActivity++;
    }
    const ggameID = props.match.params.gameID;
    const gameID = parseInt(ggameID, 10);
    const { loading, data } = useQuery(FETCH_GAME_QUERY, {
        variables: { gameID, gameID },
        onError(err) {
            console.log(err)
            console.log(err.networkError.result.errors);
          },
    });
    if (loading) {
        return "loading"
    }
    else{
        const game = data.getGame;
        const activities = game.activities;
        return(
            <Container>
                <Jumbotron>
                    <p>Current playing</p>
                    <h2>{game.name}</h2>
                </Jumbotron>
                <Row>
                <Col xs = {8}>
                <Container>
                    <Button href = 'start'> Click the Button to Start</Button>
                </Container>
                </Col>
                </Row>
            </Container>
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
            activities
        }
    }
`;

export default PlayPage;
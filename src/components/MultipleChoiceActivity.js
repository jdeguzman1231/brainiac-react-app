import React, { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Container, Jumbotron, Button, Col, Row } from "react-bootstrap";
import ReactCardFlip from 'react-card-flip'
export default function MultipleChoiceActivity(props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [endGame, setEndGame] = useState(false);
  const [flipped , setFlip] = useState(false);
  const ggameID = props.match.params.gameID;
  const gameID = parseInt(ggameID, 10);
  var game = {};
  var activities = [];
  console.log(gameID);
  const { loading: load, data: gameData } = useQuery(FETCH_GAME_QUERY, {
    variables: { gameID: gameID },
    onError(err) {
      console.log(err);
      console.log(err.networkError.result.errors);
    },
  });
  if (load) {
  } else {
    console.log(gameData);
    game = gameData;
    activities = game.getGame.activities;
  }

  console.log(game.getGame);
  console.log(activities);

  console.log(
    useQuery(FETCH_ACTIVITY_QUERY, {
      variables: {
        activityID: activities[currentActivity],
      },
      skip: !gameData,
      onError(err) {
        console.log(err.networkError.result.errors);
      },
    })
  );
  const { loading, data } = useQuery(FETCH_ACTIVITY_QUERY, {
    variables: {
      activityID: activities[currentActivity],
    },
    onError(err) {
      console.log(err.networkError.result.errors);
    },
  });

  if (loading) {
    return "loading";
  } else {
    console.log(data);

    const activityData = data.getActivity;
    console.log(activityData.data);
    // const questions = [activityData.data];
    const questions = activityData.data;

    const handleAnswerButtonClick = (answer, selected) => {
      if (selected === answer) {
        setScore(score + 1);
      }
      console.log(answer);
      console.log(selected);
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        console.log(answer);
        console.log(selected);
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }
    };

    const nextActivity = () => {
        var next = currentActivity + 1;
        if (next<activities.length) {
            setCurrentActivity(next);
        }
        else {
            setEndGame(true);
        }
    }
    const type = activityData.type;
    console.log(type);
    if(type === "multiple"){
    return (
    <Container>
        {endGame ? (
            <Container> 
                You completed the game!
            </Container>
        ) : (
      <Container>
        {showScore ? (
          <Container>
            You scored {score} out of {questions.length}
          </Container>
        ) : (
          <Container>
            <Row>
              <Col>
                <Button>Last Activity</Button>
              </Col>
              <Col xs={8}>
                <Container>
                  <Jumbotron>
                    <h4>
                      Question {currentQuestion + 1}/{questions.length}
                    </h4>
                    <h2>{questions[currentQuestion][0]}</h2>
                  </Jumbotron>
                </Container>

                <Container>
                  <Col className="answer-section">
                    {questions[currentQuestion].slice(2, 6).map((option) => (
                      <Row style={{ marginBottom: "10px" }}>
                        <Button
                          onClick={() =>
                            handleAnswerButtonClick(
                              questions[currentQuestion][1],
                              option
                            )
                          }
                        >
                          {option}
                        </Button>
                      </Row>
                    ))}
                  </Col>
                </Container>
              </Col>
              <Col>
                <Button onClick = {() => nextActivity()}>Next Activity</Button>
              </Col>
            </Row>
          </Container>
        )}
      </Container>
    )
  }
</Container>
    )
}
if(type === "Flashcards"){
  
  const handleFlip = (e) =>{
    e.preventDefault();
    if(flipped == false){
      setFlip(true);
    }
    else{
      setFlip(false);
    }
  }
  return(
    <Container>
        {endGame ? (
            <Container> 
                You completed the game!
            </Container>
        ) : (
      <Container>
        {showScore ? (
          <Container>
            You scored {score} out of {questions.length}
          </Container>
        ) : (
          <Container>
            <Row>
              <Col>
                <Button>Last Activity</Button>
              </Col>
              <Col xs={8}>
                <ReactCardFlip isFlipped = {flipped} flipDirection = "horizontal">
                <Container style = {{cursor: "pointer"}}onClick = {handleFlip}>
                  <Jumbotron>
                    <h4>
                      Question:
                    </h4>
                    <h2>{questions[currentQuestion][0]}</h2>
                    <h6>Click to see answer</h6>
                  </Jumbotron>
                </Container>
                <Container style = {{cursor: "pointer"}} onClick = {handleFlip}>
                  <Jumbotron>
                    <h4>Answer:</h4>
                    <h2>{questions[currentQuestion][1]}</h2>
                  </Jumbotron>
                </Container>
                </ReactCardFlip>
              </Col>
              <Col>
                <Button onClick = {() => nextActivity()}>Next Activity</Button>
              </Col>
            </Row>
          </Container>
        )}
      </Container>
    )
  }
</Container>
  )
}
}
}

const FETCH_ACTIVITY_QUERY = gql`
  query($activityID: Int!) {
    getActivity(activityID: $activityID) {
      type
      activityID
      data
    }
  }
`;

const FETCH_GAME_QUERY = gql`
  query($gameID: Int!) {
    getGame(gameID: $gameID) {
      name
      creatorName
      description
      parentPlatform
      tags
      activities
    }
  }
`;

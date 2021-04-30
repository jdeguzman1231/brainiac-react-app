import React, { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Container, Jumbotron, Button, Col, Row, Form } from "react-bootstrap";
import ReactCardFlip from 'react-card-flip'
export default function MultipleChoiceActivity(props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [endGame, setEndGame] = useState(false);
  const [flipped, setFlip] = useState(false);
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
      console.log(activities)
      var next = currentActivity + 1;
      if (next < activities.length) {
        setScore(0);
        setCurrentQuestion(0);
        setShowScore(false);
        setCurrentActivity(next);
      }
      else {
        setEndGame(true);
      }
    }

    const retryActivity = () => {
      console.log(activities)
      setScore(0);
      setCurrentQuestion(0);
      setShowScore(false);
    }
    const type = activityData.type;
    console.log(type);
    if (type === "multiple") {
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
                    <h1>You have completed this Multiple Choice activity</h1>
                    <h2>You scored {score} out of {questions.length}</h2>
                    <h4>Would you like to go on to the next activity in the game?</h4>
                    <Row>
                      <Button onClick={() => nextActivity()} style={{ marginBottom: '10px' }}>Go on to next activity</Button>
                    </Row>
                    <Row>
                      <Button onClick={() => retryActivity()}>Retry activity</Button>
                    </Row>
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
                          <Button onClick={() => nextActivity()}>Next Activity</Button>
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
    if (type === "Flashcards") {

      const handleFlip = (e) => {
        e.preventDefault();
        if (flipped == false) {
          setFlip(true);
        }
        else {
          setFlip(false);
        }
      }
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
                    <h1>You have completed this Flashcard activity</h1>
                    <h2>You scored {score} out of {questions.length}</h2>
                    <h4>Would you like to go on to the next activity in the game?</h4>
                    <Row>
                      <Button onClick={() => nextActivity()} style={{ marginBottom: '10px' }}>Go on to next activity</Button>
                    </Row>
                    <Row>
                      <Button onClick={() => retryActivity()}>Retry activity</Button>
                    </Row>
                  </Container>
                ) : (
                    <Container>
                      <Row>
                        <Col>
                          <Button>Last Activity</Button>
                        </Col>
                        <Col xs={8}>
                          <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
                            <Container style={{ cursor: "pointer" }} onClick={handleFlip}>
                              <Jumbotron>
                                <h4>
                                  Question:
                    </h4>
                                <h2>{questions[currentQuestion][0]}</h2>
                                <h6>Click to see answer</h6>
                              </Jumbotron>
                            </Container>
                            <Container style={{ cursor: "pointer" }} onClick={handleFlip}>
                              <Jumbotron>
                                <h4>Answer:</h4>
                                <h2>{questions[currentQuestion][1]}</h2>
                              </Jumbotron>
                            </Container>
                          </ReactCardFlip>
                        </Col>
                        <Col>
                          <Button onClick={() => nextActivity()}>Next Activity</Button>
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

    if (type === "fill") {
      const handleFillButton = (answer, input) => {
        if (input === answer) {
          setScore(score + 1);
        }
        console.log(answer);
        console.log(input);
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
          console.log(answer);
          console.log(input);
          setCurrentQuestion(nextQuestion);
        } else {
          setShowScore(true);
        }
      }
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
                    <h1>You have completed this Fill in the Blank activity</h1>
                    <h2>You scored {score} out of {questions.length}</h2>
                    <h4>Would you like to go on to the next activity in the game?</h4>
                    <Row>
                      <Button onClick={() => nextActivity()} style={{ marginBottom: '10px' }}>Go on to next activity</Button>
                    </Row>
                    <Row>
                      <Button onClick={() => retryActivity()}>Retry activity</Button>
                    </Row>
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
                              <h2>{questions[currentQuestion][2]}</h2>
                              <Form.Group controlId="answer">
                                <Form.Control type="text"
                                  name="answer" />
                              </Form.Group>
                              <h2>{questions[currentQuestion][3]}</h2>
                              <Button onClick={() => handleFillButton(questions[currentQuestion][1], document.getElementById("answer").value)}>
                                {/* <Button> */}
                                Submit Answer
                    </Button>
                            </Col>
                          </Container>
                        </Col>
                        <Col>
                          <Button onClick={() => nextActivity()}>Next Activity</Button>
                        </Col>
                      </Row>
                    </Container>
                  )}
              </Container>
            )
          }
        </Container>
      );
    }
    if (type == "matching") {
      var unshuffled = questions.flat(2);
      var clean = unshuffled.filter(x => x !== null);
      let shuffled = clean
        .map((a) => ({ sort: Math.random(), value: a }))
        .sort((a, b) => a.sort - b.sort)
        .map((a) => a.value);

      let hasClicked = false;
      let firstCard, secondCard;
      let firstColor, secondColor;
      let ind;
      const timeCounter = document.querySelector(".timer");
      let time;
      let minutes = 0;
      let seconds = 0;
      let timeStart = false;
      let timeTaken= "";

      function highlight(val) {
        var highlight;
        for (var i = 0; i < shuffled.length; i++) {
          if (shuffled[i] == val) {
            highlight = i;
          }
        }
        return highlight
      }
      function timer() {
        // Update the count every 1 second
        time = setInterval(function () {
          seconds++;
          if (seconds === 60) {
            minutes++;
            seconds = 0;
          }
          const timeCounter = document.querySelector(".timer");
          timeCounter.innerHTML =  minutes + " minutes " + seconds + " seconds";
        }, 1000);
      }
      function stopTime() {
        clearInterval(time);
      }

      function clickCard(val) {
        if (timeStart === false) {
          timeStart = true;
          timer();
        }

        console.log("clicked", val)

        if (!hasClicked) {
          hasClicked = true;
          firstCard = val;
          firstColor = document.getElementsByClassName("matching-card")[highlight(val)]
          firstColor.classList.add('selected-match')
          console.log(hasClicked, firstCard);
        }
        else {
          hasClicked = false;
          secondCard = val;
          console.log(hasClicked, secondCard, firstCard)
          secondColor = document.getElementsByClassName("matching-card")[highlight(val)]
          secondColor.classList.add('selected-match')

          for (var i = 0; i < questions.length; i++) {
            for (var j = 0; j < questions[i].length; j++) {
              if (questions[i][j] === firstCard) {
                var ind = i;
                console.log(ind)
              }
            }
          }
          if (questions[ind].includes(secondCard) && firstCard != secondCard) {
            console.log("yay")
            firstColor.classList.remove('selected-match')
            secondColor.classList.remove('selected-match')
            firstColor.classList.add('correct-match')
            secondColor.classList.add('correct-match')
            if (document.getElementsByClassName("correct-match").length == shuffled.length) {
              console.log("game finished", "correct-match".length, shuffled.length);
              stopTime();
              setShowScore(true);
              timeTaken=document.querySelector('.timer').innerHTML
              console.log("time",timeTaken)
              return(timeTaken)
            }

          }
          else {
            console.log("no")
            firstColor.classList.remove('selected-match')
            secondColor.classList.remove('selected-match')
          }
        }
      }

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
                    <h1>You have completed this Matching activity</h1>
                    
                    <h2>You finished in {timeTaken=document.querySelector('.timer').innerHTML}</h2>
                    <h4>Would you like to go on to the next activity in the game?</h4>
                    <Row>
                      <Button onClick={() => nextActivity()} style={{ marginBottom: '10px' }}>Go on to next activity</Button>
                    </Row>
                    <Row>
                      <Button onClick={() => retryActivity()}>Retry activity</Button>
                    </Row>
                  </Container>
                ) : (
                    <Container>
                      <Row>
                        <Col>
                          <Button>Last Activity</Button>
                        </Col>
                        <Col xs={8}>
                          <div class="matching-screen">
                            <p>Timer:</p>
                            <div class="timer-container">
                              <span class="timer">0 minutes 0 seconds</span>
                            </div>
                            <Container>
                              <Row>{loading ? (<h1>Loading...</h1>) : (
                                shuffled.map((card) => (
                                  <Col >
                                    <div class="matching-card" onClick={() => clickCard(card)}>
                                      <p> {card} </p>
                                    </div>
                                  </Col>
                                ))
                              )}
                              </Row>
                            </Container>
                          </div>
                        </Col>
                        <Col>
                          <Button onClick={() => nextActivity()}>Next Activity</Button>
                        </Col>
                      </Row>
                    </Container>
                  )}
              </Container>
            )
          }
        </Container>





      )

      // end of return

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

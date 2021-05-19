import React, { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Container, Jumbotron, Button, Col, Row, Form, Alert } from "react-bootstrap";
import ReactCardFlip from 'react-card-flip'
export default function MultipleChoiceActivity(props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [currentActivity, setCurrentActivity] = useState(0);
  const [endGame, setEndGame] = useState(false);
  const [flipped, setFlip] = useState(false);
  const [alert, setAlert] = useState(false)
  const [showAlert, setShowAlert] = useState(false);
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
      // setShowAlert(true)
      if (selected === answer && !showAlert) {
        setScore(score + 1);
      }
      if (selected === answer) {
        setShowAlert(true)
        setAlert(true)
      }
      else {
        setAlert(false)
        setShowAlert(true)
      }
      console.log(answer);
      console.log(selected);

    };

    const handleNextQuestion = () => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setShowAlert(false);
        setAlert(false);
      } else {
        setShowScore(true);
        setShowAlert(false);
        setAlert(false);
      }
    }

    const nextActivity = () => {
      setShowAlert(false);
      setAlert(false);
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

    const lastActivity = () => {
      console.log(activities)
      var prev = currentActivity - 1;
      setScore(0);
      setCurrentQuestion(0);
      setShowScore(false);
      if (prev < 0) {
        setCurrentActivity(0);
      }
      else {
        setCurrentActivity(prev);
      }
    }

    const retryActivity = () => {
      console.log(activities)
      setScore(0);
      setCurrentQuestion(0);
      setShowScore(false);
      setShowAlert(false);
    }
    const type = activityData.type;
    console.log(type);
    if (type === "multiple") {
      return (
        <Container>
          {endGame ? (
            <Container>
              <h1>Congratulations</h1>
              <h2>You have completed {game.getGame.name}</h2>
              <Row>
                <Button href="/">Go back to home page</Button>
              </Row>
              <Row>
                <Button href={`/platform/${game.getGame.parentPlatform}`}>Go back to platform</Button>
              </Row>
            </Container>
          ) : (
              <Container style={{paddingBottom:"20px"}}>
                {showScore ? (
                  <Container style={{ width: "80%", background: "rgba(49, 48, 48, 0.8)" }}>
                    <div class="end-activity">
                      Congratulations, you have completed Activity {currentActivity + 1} of {activities.length}
                      <br></br>You scored {score} out of {questions.length}!
                    </div>

                    <Row>
                      <Button variant="light" onClick={() => nextActivity()} style={{ marginBottom: '10px', width: "20%", margin: "auto" }}>Next Activity</Button>
                    </Row>
                    <Row>
                      <Button variant="light" onClick={() => retryActivity()}>Retry activity</Button>
                    </Row>
                  </Container>
                ) : (
                    <Container style={{paddingBottom:"20px"}}>
                      <Row style = {{paddingBottom: "20px"}}>
                        <Col>
                          <Button variant="light" style = {{float: "left"}}onClick={() => lastActivity()}>Last Activity</Button>
                        </Col>
                        <Col>
                          <Button variant="light" style = {{float: "right"}} onClick={() => nextActivity()}>Next Activity</Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          {/* Outer Screen */}
                          <Container style={{width: "80%", background: 'radial-gradient(60.34% 81.2% at 50% 50%, #FDFF83 0%, rgba(255, 255, 255, 0) 100%), #C6DFBE' }}>
                            <div class="activity-progress-card">
                              <p>Activity {currentActivity + 1} of {activities.length} </p>
                            </div>
                            {/* Question Card */}
                            <Container style={{ height: "80%", backgroundColor: "#FFF8E8", width: "70%", borderRadius: "30px" }}>
                              <div style={{ textAlign: "center", fontSize: "25px", paddingTop: "25px", paddingBottom: "10px" }}>
                                {currentQuestion + 1}. {questions[currentQuestion][0]}
                              </div>
                              <Container style={{ paddingBottom: "25px" }}>
                                {alert
                                  ? <Alert show={showAlert} variant="success">Correct!</Alert>
                                  : <Alert show={showAlert} variant="danger">Wrong answer. Try again.</Alert>
                                }
                                <Col className="answer-section">

                                  {questions[currentQuestion].slice(2, 6).map((option) => (
                                    <Row style={{ marginBottom: "10px" }}>
                                      <Button variant="option" block
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
                                  {alert
                                    ? <Button style={{ fontSize: "14px", width:"100%", margin:"auto" }} show={showAlert} onClick={handleNextQuestion} variant="secondary">Next Question</Button>
                                    : <br></br>
                                  }
                                </Col>
                              </Container>
                            </Container>
                            <div style={{ textAlign: "right" }}><p>{questions.length - currentQuestion - 1} questions left</p></div>

                          </Container>
                        </Col>
                      </Row>
                    </Container>
                  )}
              </Container>
            )
          }
          <h2>{game.getGame.name}</h2>
          <p>by {game.getGame.creatorName}</p>
          <hr></hr>
          <p>{game.getGame.description}</p>
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
              <h1>Congratulations</h1>
              <h2>You have completed {game.getGame.name}</h2>
              <Row>
                <Button href="/">Go back to home page</Button>
              </Row>
              <Row>
                <Button href={`/platform/${game.getGame.parentPlatform}`}>Go back to platform</Button>
              </Row>
            </Container>
          ) : (
              <Container>
                {showScore ? (
                  <Container style={{ background: "rgba(49, 48, 48, 0.8)" }}>
                    <div class="end-activity">
                      Congratulations, you have completed Activity {currentActivity + 1} of {activities.length}
                  </div>

                    <Row>
                      <Button variant="light" onClick={() => nextActivity()} style={{ marginBottom: '10px', width: "20%", margin: "auto" }}>Next Activity</Button>
                    </Row>
                    <Row>
                      <Button variant="light" onClick={() => retryActivity()}>Retry activity</Button>
                    </Row>
                  </Container>
                ) : (
                    <Container style={{paddingBottom:"20px"}}>
                      <Row style = {{paddingBottom: "20px"}}>
                        <Col>
                          <Button variant="light" style = {{float: "left"}}onClick={() => lastActivity()}>Last Activity</Button>
                        </Col>
                        <Col>
                          <Button variant="light" style = {{float: "right"}} onClick={() => nextActivity()}>Next Activity</Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div style={{ width:"80% ",padding: "60px", background: "linear-gradient(180deg, rgba(255, 200, 200, 0) 0%, #FFEEDB 99.99%, rgba(255, 255, 255, 0.979167) 100%), #FDDBDB" }}>
                            <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
                              <div style={{padding: "100px", cursor: "pointer", background: "#FFFFFF", width: "80%", borderRadius: "15px", backdropFilter: "blur(4px)", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.08)", margin: "auto"}} onClick={handleFlip}>

                                <div style={{ textAlign: "center", fontSize: "25px", paddingTop: "25px", paddingBottom: "10px" }}>
                                  {questions[currentQuestion][0]}
                                </div>
                                <div style={{ textAlign: "right" }}><p>Click to flip</p></div>


                              </div>

                              <div style={{ padding: "100px", cursor: "pointer", background: "#FFFFFF", width: "80%", borderRadius: "15px", backdropFilter: "blur(4px)", boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.08)", margin: "auto"}} onClick={handleFlip}>
                                <div style={{ textAlign: "center", fontSize: "25px", paddingTop: "25px", paddingBottom: "10px" }}>
                                  {questions[currentQuestion][1]}
                                </div>
                                <div style={{ textAlign: "right" }}><p>Click to flip</p></div>
                              </div>

                            </ReactCardFlip>
                          </div>

                        </Col>
                      
                      </Row>
                    </Container>
                  )}
              </Container>
            )
          }
          <h2>{game.getGame.name}</h2>
          <p>by {game.getGame.creatorName}</p>
          <hr></hr>
          <p>{game.getGame.description}</p>
        </Container>
      )
    }

    if (type === "fill") {
      const handleFillButton = (answer, input) => {
        if (input === answer && !showAlert) {
          setScore(score + 1);
        }
        if (input === answer) {
          setAlert(true)
          setShowAlert(true)
        }
        else {
          setAlert(false)
          setShowAlert(true)
        }
        console.log(answer);
        console.log(input);

      }
      return (
        <Container>
          {endGame ? (
            <Container>
              <h1>Congratulations</h1>
              <h2>You have completed {game.getGame.name}</h2>
              <Row>
                <Button href="/">Go back to home page</Button>
              </Row>
              <Row>
                <Button href={`/platform/${game.getGame.parentPlatform}`}>Go back to platform</Button>
              </Row>
            </Container>
          ) : (
              <Container>
                {showScore ? (
                  <Container style={{ background: "rgba(49, 48, 48, 0.8)" }}>
                    <div class="end-activity">
                      Congratulations, you have completed Activity {currentActivity + 1} of {activities.length}
                      <br></br>You scored {score} out of {questions.length}!
                  </div>

                    <Row>
                      <Button variant="light" onClick={() => nextActivity()} style={{ marginBottom: '10px', width: "20%", margin: "auto" }}>Next Activity</Button>
                    </Row>
                    <Row>
                      <Button variant="light" onClick={() => retryActivity()}>Retry activity</Button>
                    </Row>
                  </Container>
                ) : (
                    <Container style={{paddingBottom:"20px"}}>
                      <Row style = {{paddingBottom: "20px"}}>
                        <Col>
                          <Button variant="light" style = {{float: "left"}}onClick={() => lastActivity()}>Last Activity</Button>
                        </Col>
                        <Col>
                          <Button variant="light" style = {{float: "right"}} onClick={() => nextActivity()}>Next Activity</Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div style={{ width:"80%", paddingTop:"30px", paddingBottom:"30px", background: "linear-gradient(180deg, #B19B9B 0%, rgba(255, 255, 255, 0) 100%), #8DA9C4" }}>
                            <div class="activity-progress-card">
                              <p>Activity {currentActivity + 1} of {activities.length} </p>
                            </div>

                            <Container style={{ background: "#EEF4ED", borderRadius: "30px", height: "80%", width: "70%", paddingBottom: "20px" }}>

                              <div style={{ textAlign: "center", fontSize: "25px", paddingTop: "25px", paddingBottom: "10px" }}>
                                {currentQuestion + 1}. {questions[currentQuestion][0]}
                              </div>
                              {alert
                                ? <Alert show={showAlert} variant="success">Correct</Alert>
                                : <Alert show={showAlert} variant="danger">Wrong. The correct answer is {questions[currentQuestion][1]}</Alert>
                              }
                              <Col className="answer-section">
                                {questions[currentQuestion][2]}
                                <Form.Group controlId="answer">
                                  <Form.Control type="text"
                                    name="answer" />
                                </Form.Group>
                                {questions[currentQuestion][3]}
                                <Row>
                                  {alert
                                    ? <br></br>
                                    : <Button onClick={() => handleFillButton(questions[currentQuestion][1], document.getElementById("answer").value)}>Submit Answer</Button>
                                  }

                                </Row>
                                {alert
                                  ? <Button style={{ fontSize: "14px", width: "50%", alignSelf: "center" }} show={showAlert} onClick={handleNextQuestion} variant="secondary">Next Question</Button>
                                  : <br></br>
                                }

                              </Col>

                            </Container>

                            <div style={{ textAlign: "right" }}><p>{questions.length - currentQuestion - 1} questions left</p></div>
                          </div>


                        </Col>

                      </Row>
                    </Container>
                  )}
              </Container>
            )
          }
          <h2>{game.getGame.name}</h2>
          <p>by {game.getGame.creatorName}</p>
          <hr></hr>
          <p>{game.getGame.description}</p>
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
      let timeTaken = "";

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
          timeCounter.innerHTML = minutes + " minutes " + seconds + " seconds";
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
        // if first click
        if (!hasClicked) {
          hasClicked = true;
          firstCard = val;
          firstColor = document.getElementsByClassName("matching-card")[highlight(val)]
          firstColor.classList.add('selected-match')
          console.log(hasClicked, firstCard);
        }
        // if second click
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
          //if correct match
          if (questions[ind].includes(secondCard) && firstCard != secondCard) {
            console.log("yay")
            firstColor.classList.remove('selected-match')
            secondColor.classList.remove('selected-match')
            firstColor.classList.add('correct-match')
            secondColor.classList.add('correct-match')
            // if last match
            if (document.getElementsByClassName("correct-match").length == shuffled.length) {
              console.log("game finished", "correct-match".length, shuffled.length);
              stopTime();
              setShowScore(true);
              timeTaken = document.querySelector('.timer').innerHTML
              console.log("time", timeTaken)
              return (timeTaken)
            }

          }
          // not a match, unselect both
          else {
            console.log("no")
            firstColor.classList.remove('selected-match')
            secondColor.classList.remove('selected-match')
          }
        }
      }

      return (
        <Container style={{ height: "70%" }}>
          {endGame ? (
            <Container>
              <h1>Congratulations</h1>
              <h2>You have completed {game.getGame.name}</h2>
              <Row>
                <Button href="/">Go back to home page</Button>
              </Row>
              <Row>
                <Button href={`/platform/${game.getGame.parentPlatform}`}>Go back to platform</Button>
              </Row>
            </Container>
          ) : (
              <Container style={{paddingBottom:"20px"}}>
                {showScore ? (
                  <Container style={{background: "rgba(49, 48, 48, 0.8)"}}>
                  <div class="end-activity">
                  Congratulations, you have completed Activity {currentActivity + 1} of {activities.length}
                  <br></br>You finished in {timeTaken = document.querySelector('.timer').innerHTML}!
                  </div>
                  
                  <Row>
                    <Button variant="light" onClick={() => nextActivity()} style={{ marginBottom: '10px', width: "20%", margin: "auto" }}>Next Activity</Button>
                  </Row>
                  <Row>
                    <Button variant="light" onClick={() => retryActivity()}>Retry activity</Button>
                  </Row>
                </Container>
                ) : (
                    <Container style={{paddingBottom:"20px"}}>
                      <Row style = {{paddingBottom: "20px"}}>
                        <Col>
                          <Button variant="light" style = {{float: "left"}}onClick={() => lastActivity()}>Last Activity</Button>
                        </Col>
                        <Col>
                          <Button variant="light" style = {{float: "right"}} onClick={() => nextActivity()}>Next Activity</Button>
                        </Col>
                      </Row>
                      <Row>
                        
                          <Container style={{ background: "linear-gradient(180deg, #FBEDD7 0%, rgba(255, 255, 255, 0) 100%), #FAEEEE" , fontFamily:"DM Sans", paddingTop:"20px", paddingBottom:"40px"}}>
                            <h5>Timer:</h5>
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

                          </Container>


                        
                        
                      </Row>
                    </Container>
                  )}
              </Container>
            )
          }
          <h2>{game.getGame.name}</h2>
          <p>by {game.getGame.creatorName}</p>
          <hr></hr>
          <p>{game.getGame.description}</p>
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

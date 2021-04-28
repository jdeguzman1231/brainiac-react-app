import React, { useState } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Container, Jumbotron, Button, Col, Row } from "react-bootstrap";

export default function MultipleChoiceActivity() {
const [currentQuestion, setCurrentQuestion] = useState(0);
const [showScore, setShowScore] = useState(false);
const [score, setScore] = useState(0);

  const { loading, data } = useQuery(FETCH_ACTIVITY_QUERY, {
    variables: {
      activityID: 60490225,
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
    const questions = activityData.data;

    const handleAnswerButtonClick = (answer, selected) => {
        if (selected === answer) {
            setScore(score + 1);
        }
        console.log(answer)
        console.log(selected)
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            console.log(answer)
            console.log(selected)
            setCurrentQuestion(nextQuestion);
        }
        else {
            setShowScore(true)
        };
    }

    
    return (
      <Container>
        {showScore ? (
          <Container>You scored {score} out of {questions.length}</Container>
        ) : (
          <Container>
            <Container>
              <Jumbotron>
                <h4>Question {currentQuestion + 1}/{questions.length}</h4>
                <h2>{questions[currentQuestion][0]}</h2>
              </Jumbotron>
            </Container>
            <Container>
                <Col className = "answer-section">
                    {
                    questions[currentQuestion].slice(2,6).map((option) => 
                    <Row style = {{marginBottom: '10px'}} >
                        <Button onClick = {()=> handleAnswerButtonClick(questions[currentQuestion][1], option)}>{option}</Button>
                    </Row>
                    )}
                </Col>
            </Container>
          </Container>
        )}
      </Container>
    );
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

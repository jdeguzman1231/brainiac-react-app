import React from 'react';
import ActivityCard from './../components/ActivityCard';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import {Container, Row, Col, Button, Card} from "react-bootstrap";
import QuestionCard from "./../components/QuestionCard";

function ActivityPage(props) {
    const aactivityID = props.match.params.activityID;
    const activityID = parseInt(aactivityID, 10);
    const { loading, data } = useQuery(FETCH_ACTIVITY_QUERY, {
        variables: { activityID: activityID },
    });
    console.log(activityID);
    if (loading) return "loading"
    else{
        var title;
        var len;
        var correctAnswer;
        const activity = data.getActivity
        const questions = activity.data
        if (activity.type === 'multiple') {
            // source = multiple
            title = "Multiple Choice"
            len = 6;
        }
        else if (activity.type === 'fill') {
            // source = fill
            title = "Fill in the Blank"
            len = 4;
        }
        else if (activity.type === 'Flashcards') {
            // source = fill
            title = "Flashcards"
            len = 1;
        }
        else if (activity.type === 'matching') {
            title = "Matching"
            len = 1;
        }
        return (
            <Container>
                Activity Page
                <p>Type: {title}</p>
                <Row style = {{paddingBottom: '10px'}}>
                        {questions.map((question, key) => (
                            <Card style = {{ width: '22rem' }}>
                            <Card.Body>
                                <p>{key+1}</p>
                                <Card.Title>{question[0]}</Card.Title>
                                {question.slice(1,len).map((quest) =>
                                    <p>{quest}</p>
                                )}
                                <Button>Edit</Button>
                            </Card.Body>
                            </Card>
                        ))}
                </Row>
                <Button>Add a question</Button>
            </Container>
        )
    }
}

export default ActivityPage;

const FETCH_ACTIVITY_QUERY = gql`
    query($activityID: Int!){
        getActivity(activityID: $activityID){
            type
            data
        }
    }  
`;

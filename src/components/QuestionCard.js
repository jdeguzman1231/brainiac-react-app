import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import {Card} from 'react-bootstrap';
import { Link } from 'react-router-dom'
// import fill from './../images/fill.png'
// import multiple from './../images/multiple.png'
function QuestionCard(item){
    console.log(item)
    return (
        <Card style={{ width: '13rem' }}>
            <Card.Img variant="top"/>
            <Card.Body>
                <Card.Title>{item}</Card.Title>
            </Card.Body>
        </Card>
    )
}

export default QuestionCard;

const FETCH_ACTIVITY_QUERY = gql`
    query($activityID: Int!){
        getActivity(activityID: $activityID){
            type
            data
        }
    }  
`;



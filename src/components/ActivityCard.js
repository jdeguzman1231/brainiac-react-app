import React from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'
// import fill from './../images/fill.png'
// import multiple from './../images/multiple.png'
function ActivityCard(id) {
    const activityID = parseInt(id['activityID'], 10);
    const { loading, data } = useQuery(FETCH_ACTIVITY_QUERY, {
        onError(err) {
            console.log(err.networkError.result.errors);
        },
        variables: { activityID: activityID },
    });
    console.log(activityID);
    if (loading) { return "loading" }
    else {
        const activity = data.getActivity
        const gameID = activity.parentGame
        const platformID = activity.parentPlatform
        var source;
        var title;
        if (activity.type === 'multiple') {
            // source = multiple
            title = "Multiple Choice"
        }
        else if (activity.type === 'fill') {
            // source = fill
            title = "Fill in the Blank"
        }
        else if (activity.type === 'Flashcards') {
            // source = fill
            title = "Flashcards"
        }
        else if (activity.type === 'matching') {
            title = "Matching"
        }
        return (
            <Card style={{ width: '13rem' }}>
                <Card.Img variant="top" src={source} />
                <Card.Body>
                    <Card.Title>{title}</Card.Title>
                    <Link to={`/platform/${platformID}/game/${gameID}/design/activity/${activityID}`}>edit</Link>
                </Card.Body>
            </Card>
        )
    }
}

export default ActivityCard;

const FETCH_ACTIVITY_QUERY = gql`
    query($activityID: Int!){
        getActivity(activityID: $activityID){
            type
            data
            parentPlatform
            parentGame
        }
    }  
`;
import React from 'react';
import { Card } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'

function AccountPlatformCard(id) {
    const platformID = parseInt(id['platformID'], 10);
    console.log("platformID");
    console.log(platformID);
    const { loading, data } = useQuery(FETCH_PLATFORM_QUERY, {
        variables: { platformID: platformID },
    });
    if (loading) { return "loading" }
    else {
        console.log(data)
        const platform = data.getPlatform
        return (
            <Card style={{ width: '13rem' }}>
                <Card.Img variant="top" src="holder.js/100px180" />
                <Card.Body>
                    <Card.Title>{platform.name}</Card.Title>
                    <Link to={`/platform/${platformID}`}>play</Link>
                    <Card.Text>
                        created by {platform.creatorName}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}

const FETCH_PLATFORM_QUERY = gql`
    query($platformID: Int!){
        getPlatform(platformID: $platformID){
            name
            creatorName
            description
            games
        }
    }  
`;

export default AccountPlatformCard;
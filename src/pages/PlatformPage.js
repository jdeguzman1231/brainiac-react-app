import React from 'react';
import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { Container, Col, Row, Button } from 'react-bootstrap'
import GameCard from '../components/GameCard'

function PlatformPage(props) {
    const pplatformID = props.match.params.platformID;
    var platformID = parseInt(pplatformID, 10);
    const { loading, data: pdata } = useQuery(FETCH_PLATFORM_QUERY, {
        variables: { platformID: platformID },
    });

    if (loading) { return "loading" }
    else {
        console.log(pdata)
        const platform = pdata.getPlatform
        const platform_settings = '/platform/' + pplatformID + '/settings';
        return (
            <div>
                <h1>{platform.name}</h1>
                <p>created by {platform.creatorName}</p>
                <Button size = "sm" variant="secondary">Settings</Button>
                <h3>Games:</h3>
                <Container>
                    <Row>{loading ? (<h1>Loading...</h1>) : (
                        platform.games && platform.games.map((gameID) => (
                            <Col >
                                <GameCard gameID={gameID} />
                            </Col>
                        ))
                    )}
                    </Row>
                </Container>
            </div>
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

export default PlatformPage;
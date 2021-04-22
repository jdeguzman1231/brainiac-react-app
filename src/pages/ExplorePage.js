import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client'
import PlatformCard from '../components/PlatformCard'
import { Container, Col, Row, Jumbotron} from 'react-bootstrap'
import { stripIgnoredCharacters } from 'graphql';


function ExplorePage() {
    console.log(useQuery(FETCH_PLATFORMS_QUERY));
    const { loading, data } = useQuery(FETCH_PLATFORMS_QUERY);
    if (loading) { return "loading" }
    else {
        console.log(data);
        const platforms = data.getPlatforms
        return (
            <div class="page-container">
                <Jumbotron>
                    <h1>Explore</h1>
                </Jumbotron>
                <Container>
                    <Row>{loading ? (<h1>Loading...</h1>) : (
                        platforms && platforms.map((platform) => (
                            <Col >
                                <PlatformCard platform={platform} />
                            </Col>
                        ))
                    )}
                    </Row>
                </Container>
            </div>
        );
    }
}

const FETCH_PLATFORMS_QUERY = gql`

    {
    getPlatforms{
        platformID name creatorName description
    }
}   
`;

export default ExplorePage;


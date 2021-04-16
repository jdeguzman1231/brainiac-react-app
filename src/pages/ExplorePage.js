import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client'
import PlatformCard from '../components/PlatformCard'
import {Container, Col, Row} from 'react-bootstrap'
import { stripIgnoredCharacters } from 'graphql';


function ExplorePage() {
    console.log(useQuery(FETCH_PLATFORMS_QUERY));
    const { loading, data} = useQuery(FETCH_PLATFORMS_QUERY);
    if (loading) {return "loading"}
    else {
    console.log(data);
    const platforms = data.getPlatforms
    return (
        <div>
            <h1>Explore</h1>
            
            <Container>
                <Row>{loading ? (<h1>Loading...</h1>) : (
                    platforms && platforms.map((platform) =>(
                        <Col > 
                            <PlatformCard platform={platform}/>
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
        platformID name creatorName
    }
}   
`;

export default ExplorePage;


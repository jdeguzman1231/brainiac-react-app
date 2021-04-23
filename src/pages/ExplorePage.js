import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client'
import PlatformCard from '../components/PlatformCard'
import { Container, Col, Row, Jumbotron, Form, DropdownButton, Dropdown} from 'react-bootstrap'
import { stripIgnoredCharacters } from 'graphql';
import {FETCH_PLATFORMS_QUERY} from '../graphql/queries'

function ExplorePage() {
    console.log(useQuery(FETCH_PLATFORMS_QUERY));
    const { loading, data } = useQuery(FETCH_PLATFORMS_QUERY);
    if (loading) { return "loading" }
    else {
        console.log(data);
        const platforms = data.getPlatforms
        return (
            <div class="page-container">
                <Jumbotron style = {{backgroundColor: '#9cdaf8', backgroundImage: 'linear-gradient(315deg, #9cdaf8 0%, #98fcbd 74%)'}}>
                    <h1 style = {{textAlign: 'center'}}>Explore Games</h1>
                </Jumbotron>
                <Form inline style = {{width: '100%', paddingInlineStart: '10%'}}className='mb-md-5 '>
                    <Form.Control style = {{width: '50%'}} type= 'text' placeholder ='search' className ='mr-md-3'></Form.Control>
                    <Form.Label className ='mr-md-3'>By</Form.Label>
                    <Form.Control custom as="select" className ='mr-md-3' title = 'Game title' variant ='secondary'>
                        <option value = "0">Platform name</option>
                        <option value = "1">Game title</option>
                    </Form.Control>
                    <Form.Label className ='mr-md-3'>In</Form.Label>
                    <Form.Control custom as="select" className ='mr-md-3' title = 'Any Category' variant ='secondary'>
                        <option value = "0">History</option>
                        <option value = "1">Biology</option>
                        <option value = "2">Computer Science</option>
                        <option value = "3">Geography</option>
                    </Form.Control>
                </Form>
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



export default ExplorePage;


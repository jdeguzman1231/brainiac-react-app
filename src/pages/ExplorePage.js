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
                    <DropdownButton className ='mr-md-3' id='dropdown-basic-button' title = 'Game title' variant ='secondary'>
                        <Dropdown.Item>Platform name</Dropdown.Item>
                    </DropdownButton>
                    <Form.Label className ='mr-md-3'>In</Form.Label>
                    <DropdownButton className ='mr-md-3' id='dropdown-basic-button' title = 'Any Category' variant ='secondary'>
                        <Dropdown.Item>History</Dropdown.Item>
                        <Dropdown.Item>Biology</Dropdown.Item>
                        <Dropdown.Item>Computer Science</Dropdown.Item>
                        <Dropdown.Item>Geography</Dropdown.Item>
                    </DropdownButton>
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


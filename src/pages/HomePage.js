import React, { useContext } from 'react';
import PlatformCard from '../components/PlatformCard'
import {Jumbotron, Card, Button, Container, Col, Row} from 'react-bootstrap';
import { AuthContext } from "../context/auth";
import { useQuery } from '@apollo/client'
import {FETCH_PLATFORMS_QUERY} from '../graphql/queries'
import { isReference } from '@apollo/client';
function HomePage(props) {
    const {user} = useContext(AuthContext)
    const handleRoute = () =>{
        if(user){
            props.history.push('/explore')
        }
        else{
            props.history.push('/signup')
        }
    }
    const { loading, data } = useQuery(FETCH_PLATFORMS_QUERY);
    if(loading){
        return loading;
    }
    const allPlatforms = data.getPlatforms;

    const platforms = allPlatforms.slice(0, 6);
    return (
        <div>
            <Jumbotron  style={{height: 350, backgroundColor: '#f9d29d', backgroundImage: 'linear-gradient(315deg, #f9d29d 0%, #ffd8cb 74%)'}}>
                <h1>Build Your Own Learning Tools</h1>
                <p>Create and customize simple games for a learning experience catered to you</p>
                <Button onClick = {handleRoute} variant="dark">Get Started</Button>
            </Jumbotron>
            <Jumbotron  style={{backgroundColor: '#b8c6db', backgroundImage: 'linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)', marginTop: '-32px', height: 950}}> 
                <h1 style={{textAlign: "center"}}>Explore Games</h1>
                <p style={{textAlign: "center"}}>Play games created by other users</p>
                <Container>
                    <Row>
                        {platforms.map((platform) =>(
                           <Col>
                           <PlatformCard platform={platform} />
                            </Col>
                        ))}
                    </Row>
                </Container>
                <Button style={{marginLeft:'45%', marginTop: '30px'}}href = '/explore' variant="outline-dark">See More</Button>
            </Jumbotron>
        </div>
    );
}

export default HomePage;
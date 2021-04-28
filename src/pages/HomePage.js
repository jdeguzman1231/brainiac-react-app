import React, { useContext } from 'react';
import PlatformCard from '../components/PlatformCard'
import { Jumbotron, Card, Button, Container, Col, Row } from 'react-bootstrap';
import { AuthContext } from "../context/auth";
import { useQuery } from '@apollo/client'
import { FETCH_PLATFORMS_QUERY } from '../graphql/queries'
import { isReference } from '@apollo/client';
import headerimg from '../images/headerimg.png'

function HomePage(props) {
    const { user } = useContext(AuthContext)
    const handleRoute = () => {
        if (user) {
            props.history.push('/explore')
        }
        else {
            props.history.push('/signup')
        }
    }
    const { loading, data } = useQuery(FETCH_PLATFORMS_QUERY);
    if (loading) {
        return loading;
    }
    const allPlatforms = data.getPlatforms;

    const platforms = allPlatforms.slice(0, 6);
    return (
        <div>
            <Jumbotron style={{ height: 400, background: 'radial-gradient(47.36% 200.23% at 21.49% 64.71%, #FFFEEE 0%, rgba(253, 251, 218, 0.0260417) 80.88%, rgba(255, 255, 255, 0) 100%), #BAD8D1' }}>
                <div class="home-header">
                    <h1>Build your own </h1>
                    <h1>learning tools</h1>
                    <p>Create and customize simple games for a <br></br>
                        learning experience catered to you</p>
                    <Button onClick={handleRoute} variant="custom">Get Started</Button>
                    <p><img src={headerimg}></img></p>
                </div>
            </Jumbotron>
            <Jumbotron style={{ background: 'radial-gradient(57.56% 81.11% at 85.97% 42.44%, #BEE9FC 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(63.97% 63.97% at 23.26% 36.03%, #F4DCC6 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(46.04% 86.57% at 50% 90.25%, #DDEBCB 0%, rgba(255, 255, 255, 0) 100%), #FDFDF0' }}>
                <div class="explore">
                    <h1 style={{ textAlign: "center" }}>Explore Games</h1>
                    <p style={{ textAlign: "center" }}>Play games created by other users</p>
                    <Container>
                        <Row>
                            {platforms.map((platform) => (
                                <Col>
                                    <PlatformCard platform={platform} />
                                </Col>
                            ))}
                        </Row>
                    </Container>
                    <Button style={{ marginLeft: '45%', marginTop: '30px' }} href='/explore' variant="outline-dark">See More</Button>
                </div>

            </Jumbotron>
        </div>
    );
}

export default HomePage;
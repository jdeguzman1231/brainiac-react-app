import React, { useContext } from 'react';
import PlatformCard from '../components/PlatformCard'
import { Jumbotron, Card, Button, Container, Col, Row } from 'react-bootstrap';
import { AuthContext } from "../context/auth";
import { useQuery } from '@apollo/client'
import { FETCH_PLATFORMS_QUERY } from '../graphql/queries'
import { isReference } from '@apollo/client';
import headerimg from '../images/headerimg.svg'
import icon from '../images/brainiac-icon.png';


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

    const platforms = allPlatforms.slice(0, 8);
    return (
        <div style={{ height: '100%', width: '100%', position: 'absolute' }}>
            <div class="header">
                <div class="content">
                    <div style={{
                        fontFamily: 'DM Sans',
                        fontSize: '320%',
                        width: '50%',
                        lineHeight: '120%',
                        marginLeft: '20%',
                        marginTop: '25%'
                    }}>
                        Build your own learning tools
                        </div>
                    <div style={{ fontSize: '110%', marginLeft: '20%', marginTop: '2%' }}><p>Create and customize simple games for a <br></br>
                        learning experience catered to you</p></div>
                    <Button style={{ marginLeft: '20%', fontSize:'95%', paddingLeft:'2%',  paddingRight:'2%'}} onClick={handleRoute} variant="custom">Get Started</Button>
                </div>
            </div>

            <Jumbotron style={{ marginTop: '10px', background: 'radial-gradient(57.56% 81.11% at 85.97% 42.44%, #BEE9FC 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(63.97% 63.97% at 23.26% 36.03%, #F4DCC6 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(46.04% 86.57% at 50% 90.25%, #DDEBCB 0%, rgba(255, 255, 255, 0) 100%), #FDFDF0' }}>
                <div class="explore">
                    <div style={{
                        textAlign: "center", fontFamily: 'DM Sans',
                        fontSize: '300%',
                    }}>Explore Games</div>
                    <div style={{ textAlign: "center", paddingBottom: '30px' }}>Play games created by other Brainiac users</div>
                    <Container style={{ borderRadius: '11px', paddingLeft: "2%", paddingRight: "2%", paddingBottom: "2%", background: 'rgba(255,255,255, 0.3)', backdropFilter: 'blur(5px)' }}>
                        <Row style={{ padding: '2%' }}></Row>
                        <Row>
                            {platforms.map((platform) => (
                                <Col>
                                    <PlatformCard platform={platform} />
                                </Col>
                            ))}
                        </Row>
                    </Container>
                    <Button style={{ fontFamily:'Nunito', fontSize: '110%', marginLeft: '45%', marginTop: '30px' }} href='/explore' variant="outline-dark">See More</Button>
                </div>

            </Jumbotron>
            <Jumbotron style={{ background: '#FCFBFB' }}>
                <img width={20}
                    height={20} src={icon}></img> Brainiac
            
                <div style={{fontSize:'50%'}}>© 2021</div>
            </Jumbotron>
        </div>
    );
}

export default HomePage;
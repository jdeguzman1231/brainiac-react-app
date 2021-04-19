import React from 'react';
import PlatformCard from '../components/PlatformCard'
import {Jumbotron, Card, Button} from 'react-bootstrap';
function HomePage() {
    return (
        <div>
            <Jumbotron Fluid style={{height: 350, backgroundColor: '#f9d29d', backgroundImage: 'linear-gradient(315deg, #f9d29d 0%, #ffd8cb 74%)'}}>
                <h1>Build Your Own Learning Tools</h1>
                <p>Create and customize simple games for a learning experience catered to you</p>
                <Button variant="dark">Get Started</Button>
            </Jumbotron>
            <Jumbotron Fluid style={{backgroundColor: '#b8c6db', backgroundImage: 'linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)'}}> 
                <h1 style={{textAlign: "center"}}>Explore Games</h1>
                <p style={{textAlign: "center"}}>Play games created by other users</p>
            </Jumbotron>
        </div>
    );
}

export default HomePage;
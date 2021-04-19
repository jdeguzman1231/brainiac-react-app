import React from 'react';
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function PlatformCard({ platform: { platformID, name, creatorName } }) {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Link to={`/platform/${platformID}`}>
                    <Card.Title>{name}</Card.Title>
                </Link>
                <Card.Text>
                    created by {creatorName}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default PlatformCard;
import React, {useEffect} from 'react';
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {run as runHolder} from 'holderjs/holder'
function PlatformCard({ platform: { platformID, name, creatorName, description } }) {
    useEffect(() => {
        runHolder('layoutimg')
    })
    return (
        <div>
        <Card style={{ width: '18rem'}}>
            <Card.Img className = 'layoutimg' variant="top" src="holder.js/100px180?random=yes" thumbnail/>
            <Card.Body>
                <Link to={`/platform/${platformID}`}>
                    <Card.Title>{name}</Card.Title>
                </Link>
                <Card.Subtitle className = 'mb-2 text-muted'>
                    created by {creatorName}
                </Card.Subtitle>
                <Card.Text>
                    {description}
                </Card.Text>
                
            </Card.Body>
        </Card>
        </div>
    )
}

export default PlatformCard;
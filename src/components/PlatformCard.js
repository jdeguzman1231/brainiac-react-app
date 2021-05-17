import React, {useEffect, useState} from 'react';
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {run as runHolder} from 'holderjs/holder'
function PlatformCard({ platform: { platformID, name, creatorName, description, photo } }) {
    let curphoto

    useEffect(() => {
        runHolder('layoutimg')
        
    }, [])
   
    if(photo != ''){
        curphoto = photo
    }
    else{
        curphoto = 'holder.js/100px180?random=yes'
    }
    return (
        <div class="pagecard">
        <Card style={{ width: '15rem'}}>
            <Card.Img height = {180} width = {180} variant="top" src={curphoto} thumbnail/> 
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
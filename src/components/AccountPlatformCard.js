import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap'
import { useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import {run as runHolder} from 'holderjs/holder'
import {FETCH_PLATFORM_QUERY} from '../graphql/queries'
    function AccountPlatformCard(id) {
    useEffect(() => {
        runHolder('temp')
    })
    var hasIMG = false
    const platformID = parseInt(id['platformID'], 10);
    console.log("platformID");
    console.log(platformID);
    const { loading, data } = useQuery(FETCH_PLATFORM_QUERY, {
        variables: { platformID: platformID },
    });
    if (loading) { return "loading" }
    else {
        console.log(data)
        const platform = data.getPlatform
        if(platform.photo != ''){
            hasIMG = true
        }
        return (
            <Card style={{ width: '13rem' }}>
                {hasIMG ? (
                    <Card.Img variant="top" src={platform.photo}  height = {180} width = {180}/>
                ) : (
                    <Card.Img variant="top" src="holder.js/100px180" />
                )}
                <Card.Body>
                    <Card.Title>{platform.name}</Card.Title>
                    <Link to={`/platform/${platformID}`}>play</Link>
                    <Card.Text>
                        created by {platform.creatorName}
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}



export default AccountPlatformCard;
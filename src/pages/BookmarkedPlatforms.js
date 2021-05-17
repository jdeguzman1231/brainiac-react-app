import React, {useContext, useState} from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import {Row, Col, Container, Pagination, Button, Jumbotron} from 'react-bootstrap';
import AccountPlatformCard from '../components/AccountPlatformCard'
import gql from 'graphql-tag';
import { AuthContext } from "../context/auth";


function BookmarkedPlatforms(props) {
    const [allpages, setAll] = useState([])
    const [page, setPage] = useState({number: 0, contents: []})
    const { user, logout } = useContext(AuthContext);
    var username = user.username
    const {loading, data} = useQuery(FETCH_USER_QUERY, {
        variables: {
            username: username
        },
        onError(err) {
            console.log(err.networkError.result.errors);
        },
        fetchPolicy: 'cache-and-network'
    });
    const switchPage = (e) =>{
        const targetPage = parseInt(e.target.id)
        const pageReq = allpages[targetPage]
        const pgnum = targetPage + 1
        setPage({number: pgnum, contents: pageReq})


    }
    if (loading) {return "loading"}
    else {
        console.log(data)
        const user = data.getUser
        const platformList = user.bookmarkedPlatforms
        var cpSize = platformList.length 
        const pagesRequired = Math.ceil(cpSize / 8)
        var totals = []
        var remaining = cpSize
        for(var i = 0; i < pagesRequired; i++){
            var temp = []
            var elem = Math.min(8, remaining)
            for(var j = 0; j<elem; j++){
                var index = (i*8) + j
                temp.push(platformList[index])
                remaining -= 1
            }
            totals.push(temp)
        }
        console.log(totals)
        if(allpages.length == 0){
            setAll(totals)
        }
        if(page.contents.length == 0){
            setPage({number: 1, contents: totals[0]})
        }
        console.log('contents: ' + page.contents + ' length: ' + page.contents.length)
        
        var items = []
        console.log(totals[0])
        for(var i = 0; i < pagesRequired; i++){
            items.push(
                <Pagination.Item onClick = {switchPage} id = {i.toString()} key = {i} active = {(i + 1) == page.number}>{i + 1}</Pagination.Item>
            )
        }
    return(
        <Container>
        <Jumbotron>
            <h3>@{username}'s Bookmarked Platforms</h3>
        </Jumbotron>
        <Row style = {{paddingBottom: '10px'}}>
                        {page.contents.map((platformID) => (
                        <Col >
                            <AccountPlatformCard platformID={platformID} />
                        </Col>
                        ))}
                    </Row>
                <Pagination style = {{marginBottom: '200px', justifyContent: 'center'}}>
                    {items}
                </Pagination>
        </Container>
    );
    }
}

export default BookmarkedPlatforms;

const FETCH_USER_QUERY = gql`
    query($username: String!) {
        getUser(username: $username) 
        {
            username
            email
            name
            createdPlatforms
            playedPlatforms
            bookmarkedPlatforms
        }
    }
`
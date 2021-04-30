
import { useQuery, useMutation } from '@apollo/client'
import { Container, Col, Row, Jumbotron, Button, Modal } from 'react-bootstrap'
import GameCard from '../components/GameCard'
import gql from 'graphql-tag';
import { AuthContext } from "../context/auth";
import { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

function PlatformPage(props) {

    function refresh() {
        window.location.reload();
    }
    
    const [bookmarked, setBookmarked] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { user, logout } = useContext(AuthContext);
    if (user) {
        var creatorName = user.username;
    }
    else {
        var creatorName = '';
    }

    const pplatformID = props.match.params.platformID;
    var platformID = parseInt(pplatformID, 10);
    const parentPlatform = platformID
    const platformURL = '/platform/' + pplatformID;

    const {loading: loadingg, data: userData} = useQuery(FETCH_USER_QUERY, {
        variables: {username: creatorName}
    });

    var bookmarkedPlatforms = [];
    if (loadingg) {

    }
    else {
        if (userData != null) {
            bookmarkedPlatforms = JSON.parse(JSON.stringify(userData.getUser.bookmarkedPlatforms));
        }
    }

    const [bookmarkedPlats, setBookmarkedPlats] = useState(bookmarkedPlatforms);

    const { loading, data: pdata } = useQuery(FETCH_PLATFORM_QUERY, {
        variables: { platformID: platformID },
        fetchPolicy: 'cache-and-network'
    });


    const platform_settings = '/platform/' + pplatformID + '/settings';
    const toSettings = () => {
        props.history.push(platform_settings);
    }
    const [bookmark] = useMutation(BOOKMARK_PLATFORM, {
        update(proxy, results) {
            props.history.push(platformURL)
        },
        onError(err) {
            console.log(err.networkError.result.errors);
        },
        variables: {
            username: creatorName,
            platformID: platformID
        }
    })
    function bookmarkPlatform() {
        
        setBookmarkedPlats(bookmarkedPlats.push(platformID));
        console.log(bookmarkedPlatforms);
        console.log("bookmark");
        setBookmarked(true);
        bookmark();
    }


    const [unbookmark] = useMutation(UNBOOKMARK_PLATFORM, {
        update(proxy, results) {
            props.history.push(platformURL)
        },
        onError(err) {
            console.log(err.networkError.result.errors);
        },
        variables: {
            username: creatorName,
            platformID: platformID
        }
    })
    function unbookmarkPlatform() {
        var oldArray = JSON.parse(JSON.stringify(userData.getUser.bookmarkedPlatforms))
        const index = oldArray.indexOf(platformID);
        oldArray.splice(index, 1);
        setBookmarkedPlats(oldArray);
        setBookmarked(false);
        unbookmark();
        
    }

    const [addGame] = useMutation(CREATE_GAME, {
        update: (proxy, { data }) => {
            console.log("new game id", data.createGame.gameID)
            try {
                const d = proxy.readQuery({ query: FETCH_PLATFORM_QUERY, variables: { platformID: platformID }, });
                var array1 = [...d.getPlatform.games]
                array1.push(data.createGame.gameID)
                proxy.writeQuery({
                    query: FETCH_PLATFORM_QUERY,
                    data: { 
                      getPlatform: {
                        platformID: platformID,
                        games: array1
                      },
                    },
                    variables: {
                      platformID: platformID

                    }
                  });
            }
            catch (error) {
                console.error(error.networkError.result.errors);
            }
        },
    })
    const [delPlatform] = useMutation(DELETE_PLATFORM, {
        update(proxy, result) {
            props.history.push("/account/" + creatorName)
        },
        onError(err) {
            console.log(err.networkError.result.errors)
        },
        variables: {
            username: creatorName,
            platformID: platformID,
        }
    })

    function deletePlatform() {
        console.log("delete platform");
        delPlatform();
    }


    if (loading) { return "loading" }
    else {
        // console.log(pdata)
        const platform = pdata.getPlatform
        // console.log(platform_settings);
        // setBookmarkedPlats(bookmarkedPlatforms);
        var bookmarkButton;
        if (!bookmarked) {
            if (bookmarkedPlats.includes(platformID)) {
                setBookmarked(true)
            }
        }
        if (creatorName == '') {
            bookmarkButton = '';
        }
        else {
            if (bookmarked)
            {
                bookmarkButton = <Button onClick={unbookmarkPlatform} variant='secondary' style={{ marginLeft: '1000px' }}>
                Unbookmark
                </Button>
            }
            else {
                bookmarkButton = <Button onClick={bookmarkPlatform} variant='secondary' style={{ marginLeft: '1000px' }}>
                Bookmark
                </Button>
            }
        }
        if (user && user.username == platform.creatorName) {
            return (
                <div className="page-container">
                    <Jumbotron>
                        <Row>
                            <Col>
                                <h1>{platform.name}</h1>
                                <br></br>
                                <p>{platform.description}</p>
                                <p>created by {platform.creatorName}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button onClick={toSettings} variant='secondary' style={{ marginLeft: '1000px', marginBottom: '10px' }}>
                                    Settings
                                </Button>
                                <Button onClick={handleShow} variant='secondary' style={{ marginLeft: '1000px', marginBottom: '10px' }}>Delete Platform</Button>
                                <Modal show={show} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Confirm Delete</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Are you sure you want to delete this platform? All games in this platform will be deleted.
                                </Modal.Body>
                                    <Modal.Footer>
                                        <Button onClick={e => {
                                            e.preventDefault();
                                            deletePlatform({ variables: { username: creatorName, platformID: platformID } });
                                        }}>Yes</Button>
                                        <Button onClick={handleClose}>No</Button>
                                    </Modal.Footer>
                                </Modal>
                                {bookmarkButton}
                                
                            </Col>
                        </Row>
                    </Jumbotron>
                    <h3>Games:</h3>
                    <Button onClick={e => {
                        e.preventDefault();
                        addGame({ variables: { creatorName: creatorName, parentPlatform: parentPlatform } });
                        // refresh();
                    }}>Add Game
                    </Button>
                    <hr></hr>
                    <Container>
                        <Row>{loading ? (<h1>Loading...</h1>) : (
                            platform.games && platform.games.map((gameID) => (
                                <Col >
                                    <GameCard gameID={gameID} />
                                </Col>
                            ))
                        )}
                        </Row>
                    </Container>
                </div>
            )
        }
        else {
            return (
                <div className="page-container">
                    <Jumbotron>
                        <h1>{platform.name}</h1>
                        <br></br>
                        <p>{platform.description}</p>
                        <p>created by {platform.creatorName}</p>

                        {bookmarkButton}

                    </Jumbotron>
                    <h3>Games:</h3>
                    <hr></hr>
                    <Container>
                        <Row>{loading ? (<h1>Loading...</h1>) : (
                            platform.games && platform.games.map((gameID) => (
                                <Col >
                                    <GameCard gameID={gameID} />
                                </Col>
                            ))
                        )}
                        </Row>
                    </Container>
                </div>
            )
        }
    }
}

const FETCH_USER_QUERY = gql`
    query($username: String!) {
        getUser(username: $username) 
        {
            bookmarkedPlatforms
        }
    }
`

const FETCH_PLATFORM_QUERY = gql`
    query($platformID: Int!){
        getPlatform(platformID: $platformID){
            name
            creatorName
            description
            games
        }
    }  
`;

const BOOKMARK_PLATFORM = gql`
    mutation bookmarkPlatform(
        $username: String!
        $platformID: Int!
    ) {
        bookmarkPlatform(
            username: $username
            platformID: $platformID
        )
    }
`;

const UNBOOKMARK_PLATFORM = gql`
    mutation unbookmarkPlatform(
        $username: String!
        $platformID: Int!
    ) {
        unbookmarkPlatform(
            username: $username
            platformID: $platformID
        )
    }
`;

const CREATE_GAME = gql`
    mutation createGame(
        $creatorName: String!
        $parentPlatform: Int!
    ) {
        createGame(
            creatorName: $creatorName
            parentPlatform: $parentPlatform
        ) {
            gameID
            creatorName
            parentPlatform
        }
    }
`


const DELETE_PLATFORM = gql`
    mutation deletePlatform(
        $username: String!
        $platformID: Int!
        ){
           deletePlatform(
                username: $username
                platformID: $platformID
            )
        }
`;

export default PlatformPage;
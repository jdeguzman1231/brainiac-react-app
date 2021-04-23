
import { useQuery, useMutation } from '@apollo/client'
import { Container, Col, Row, Jumbotron, Button, Modal } from 'react-bootstrap'
import GameCard from '../components/GameCard'
import gql from 'graphql-tag';
import { AuthContext } from "../context/auth";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

function PlatformPage(props) {
    function refresh() {
        window.location.reload();
    }
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const { user, logout } = useContext(AuthContext);
    if(user){
        var creatorName = user.username;
    }
    else{
        var creatorName = '' ; 
    }
    console.log(user)
    const pplatformID = props.match.params.platformID;
    var platformID = parseInt(pplatformID, 10);
    const parentPlatform = platformID
    const platformURL = '/platform/' + pplatformID;

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
        bookmark();
    }

    const [addGame, { loading: load, data: dataa }] = useMutation(CREATE_GAME,{
       
        update(cache,{ data: {addGame}}){
            cache.modify({
                fields:{
                    games(existingGames = []){
                        const newGameref= cache.writeFragment({


                            data: addGame,
                            fragment: gql`
                                fragment NewGame on Game{
                                    creatorName
                                    parentPlatform
                                }
                            `
                        });
                        return [...existingGames, newGameref];
                    }
                }
            })
        }

      });

   

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
        console.log(pdata)
        const platform = pdata.getPlatform
        console.log(platform_settings);
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
                                <Button onClick={handleShow}>Delete Platform</Button>
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
                                <Button onClick={bookmarkPlatform} variant='secondary' style={{ marginLeft: '1000px' }}>
                                    Bookmark
                                </Button>
                            </Col>
                        </Row>
                    </Jumbotron>
                    <h3>Games:</h3>
                    <Button onClick={e => {
                        e.preventDefault();
                        addGame({ variables: { creatorName: creatorName, parentPlatform: parentPlatform } }); refresh();
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

                        <Button onClick={bookmarkPlatform} variant='secondary' style={{ marginLeft: '1000px' }}>
                            Bookmark
                        </Button>

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

const CREATE_GAME = gql`
    mutation createGame(
        $creatorName: String!
        $parentPlatform: Int!
    ) {
        createGame(
            creatorName: $creatorName
            parentPlatform: $parentPlatform
        ) {
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
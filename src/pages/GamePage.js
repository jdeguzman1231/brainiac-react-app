import React from 'react';
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/client'
import { Form, Button, Modal, Figure, OverlayTrigger, Tooltip, Jumbotron, ButtonGroup } from 'react-bootstrap';
import { AuthContext } from "../context/auth";
import { useContext, useState, useEffect } from "react";
import { useForm } from '../util/hooks';
import { Link } from 'react-router-dom'
import { run as runHolder } from 'holderjs/holder'
import trashcan from '../images/trashcan.png'
import save from '../images/save.png'
import pencil from '../images/pencil.png'


function GamePage(props) {
    useEffect(() => {
        runHolder('layoutimg')
    })
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const ggameID = props.match.params.gameID;
    const pplatformID = props.match.params.parentPlatform
    const gameID = parseInt(ggameID, 10);
    const parentPlatform = parseInt(pplatformID, 10);
    const platformID = parentPlatform;
    const { loading, data } = useQuery(FETCH_GAME_QUERY, {
        variables: { gameID, gameID },
        fetchPolicy: 'cache-and-network'
    });
    const { loading: load, data: pdata } = useQuery(FETCH_PLATFORM_QUERY, {
        variables: { platformID, platformID }
    });
    const { user, logout } = useContext(AuthContext);
    if (user) {
        var creatorName = user.username;
    }
    else {
        var creatorName = '';
    }
    const designLink = gameID + "/design"
    const playLink = gameID + "/play"
    const { handleChange, onSubmit, values } = useForm(editGame, {
        name: '',
        description: ''
    })
    const [updateGame] = useMutation(EDIT_GAME, {
        update(proxy, result) {
            window.location.replace("/platform/" + platformID + "/game/" + gameID);
        },
        onError(err) {
            console.log(err.networkError.result.errors)
        },
        variables: {
            gameID: gameID,
            parentPlatform: parentPlatform,
            name: values.name,
            creatorName: creatorName,
            description: values.description
        }
    })

    function editGame() {
        console.log(updateGame);
        updateGame();
    }

    const [delGame] = useMutation(DELETE_GAME, {
        update(proxy, result) {
            // props.history.push("/platform/" + platformID)
            window.location.replace("/platform/" + platformID);
            const d = proxy.readQuery({ query: FETCH_PLATFORM_QUERY, variables: { platformID: platformID }, });
            var array1 = [...d.getPlatform.games]
            var ind;
            for (var i = 0; i < array1.length; i++) {
                if (array1[i] == gameID) {
                    ind = i
                }
            }
            array1.splice(ind, 1)
            console.log("here", d, array1)
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

        },
        onError(err) {
            console.log(err.networkError.result.errors)
        },
        variables: {
            gameID: gameID,
            platformID: platformID,
        }
    })

    // function deleteGame() {
    //     console.log("delete game");
    //     delGame();
    // }

    if (loading) { return "loading" }
    else if (load) {return "loading"}
    else {
        console.log(data)
        const game = data.getGame
        if (user && user.username == game.creatorName) {
            return (
                <div className="game-page-container">
                    <Jumbotron style={{ background: "radial-gradient(36.11% 118.69% at 45.24% 120.39%, rgba(255, 218, 202, 0.56) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(68.25% 371.6% at 85.88% 91.75%, rgba(251, 254, 255, 0.19) 0%, rgba(195, 241, 255, 0.960065) 0.01%, rgba(255, 255, 255, 0) 99.98%, rgba(252, 254, 255, 0.0416667) 99.99%), #FFF8E7" }}><h1>{pdata.getPlatform.name}</h1>
                        <Link to={`/platform/${parentPlatform}`}>Back to platform</Link>
                    </Jumbotron>

                    <Button style={{ background: "#FFFF", borderColor: "#FFFF" }} href={playLink}>
                        <Figure class="game-screen" >

                            <Figure.Image className='layoutimg'
                                width={870}
                                height={524}
                                src="holder.js/870x524"
                            />

                        </Figure> </Button>
                    <div>
                        <ButtonGroup>
                            <OverlayTrigger
                                placement="bottom"
                                overlay={
                                    <Tooltip>
                                        Delete Game
                            </Tooltip>
                                }>
                                <Button variant="light" onClick={handleShow}><img width={30}
                                    height={30} src={trashcan}></img></Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom"
                                overlay={
                                    <Tooltip>
                                        Design Game
                            </Tooltip>
                                }>
                                <Button variant="light" href={designLink}>
                                    <img width={30}
                                        height={30} src={pencil}></img>
                                </Button>
                            </OverlayTrigger>

                        </ButtonGroup>

                    </div>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to delete this game?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={e => {
                                e.preventDefault();
                                delGame({ variables: { gameID: gameID, platformID: platformID } });
                            }}>Yes</Button>
                            <Button onClick={handleClose}>No</Button>
                        </Modal.Footer>
                    </Modal>

                    <Form onSubmit={onSubmit} noValidate>
                        <Form.Group>
                            <Form.Label>Game Title</Form.Label>
                            <Form.Control defaultValue={game.name} name="name" onChange={handleChange} size="lg" />
                        </Form.Group>
                        <p>by <Link to={`/account/${game.creatorName}`}>{game.creatorName}</Link></p>
                        <hr></hr>
                        <Form.Group >
                            <Form.Label>Description</Form.Label>
                            <Form.Control defaultValue={game.description} name="description" onChange={handleChange} />
                        </Form.Group>
                        <OverlayTrigger
                            placement="bottom"
                            overlay={
                                <Tooltip>
                                    Save Changes
                            </Tooltip>
                            }><Button variant="light " type="submit"><img width={25}
                                height={25} src={save}></img>  Save Changes</Button></OverlayTrigger>

                    </Form>
                </div>

            )
        }
        else {
            return (
                <div className="game-page-container">
                    <Jumbotron style={{ background: "radial-gradient(36.11% 118.69% at 45.24% 120.39%, rgba(255, 218, 202, 0.56) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(68.25% 371.6% at 85.88% 91.75%, rgba(251, 254, 255, 0.19) 0%, rgba(195, 241, 255, 0.960065) 0.01%, rgba(255, 255, 255, 0) 99.98%, rgba(252, 254, 255, 0.0416667) 99.99%), #FFF8E7" }}><h1>{pdata.getPlatform.name}</h1>
                        <Link to={`/platform/${parentPlatform}`}>Back to platform</Link>
                    </Jumbotron>
                    <Button style={{ background: "#FFFF", borderColor: "#FFFF" }} href={playLink}>
                        <Figure class="game-screen" >

                            <Figure.Image className='layoutimg'
                                width={870}
                                height={524}
                                src="holder.js/870x524"
                            />

                        </Figure> </Button>
                    <h2>{game.name}</h2>
                    <p>by <Link to={`/account/${game.creatorName}`}>{game.creatorName}</Link></p>
                    <hr></hr>
                    <p>{game.description}</p>
                    <p>Tags:</p>
                    <p>{game.tags}</p>
                    <Button href={playLink}>
                        Play Game
                    </Button>
                </div>
            )
        }
    }
}

const FETCH_GAME_QUERY = gql`
    query($gameID: Int!){
        getGame(gameID: $gameID){
            name
            creatorName
            description
            parentPlatform
            tags
        }
    }
`;

export const EDIT_GAME = gql`
    mutation editGame(
        $gameID: Int!
        $parentPlatform: Int!
        $name: String!
        $description: String!
        $creatorName: String!
        ){
            editGame(
                gameID: $gameID
                parentPlatform: $parentPlatform
                creatorName: $creatorName
                name: $name
                description: $description
            )
        
        }
`;


export const DELETE_GAME = gql`
    mutation deleteGame(
        $gameID: Int!
        $platformID: Int!
        ){
           deleteGame(
                gameID: $gameID
                platformID: $platformID
            )
        }
`;


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

export default GamePage;
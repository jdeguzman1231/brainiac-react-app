import React from 'react';
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/client'
import { Form, Button, Modal, Figure } from 'react-bootstrap';
import { AuthContext } from "../context/auth";
import { useContext, useState, useEffect } from "react";
import { useForm } from '../util/hooks';
import { Link } from 'react-router-dom'
import {run as runHolder} from 'holderjs/holder'


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
    });
    const { user, logout } = useContext(AuthContext);
    if (user) {
        var creatorName = user.username;
    }
    else {
        var creatorName = '';
    }
    const designLink = gameID + "/design"
    const { handleChange, onSubmit, values } = useForm(editGame, {
        name: '',
        description: ''
    })
    const [updateGame] = useMutation(EDIT_GAME, {
        // update(proxy, result) {
        //     props.history.push()
        // },
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
            props.history.push("/platform/" + platformID)
        },
        onError(err) {
            console.log(err.networkError.result.errors)
        },
        variables: {
            gameID: gameID,
            platformID: platformID,
        }
    })

    function deleteGame() {
        console.log("delete game");
        delGame();
    }

    if (loading) { return "loading" }
    else {
        console.log(data)
        const game = data.getGame

        if (user && user.username == game.creatorName) {
            return (
                <div className="game-page-container">
                    <Link to={`/platform/${parentPlatform}`}>Back to platform</Link>
                    <Figure>
                        <Figure.Image className = 'layoutimg'
                            width={870}
                            height={524}
                            src="holder.js/870x524"
                        />
                    </Figure>
                    <Button onClick={handleShow}>Delete Game</Button>
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
                                deleteGame({ variables: { gameID: gameID, platformID: platformID } });
                            }}>Yes</Button>
                            <Button onClick={handleClose}>No</Button>
                        </Modal.Footer>
                    </Modal>
                            
                    <Form onSubmit={onSubmit} noValidate>
                        <Form.Group>
                            <Form.Label>Game Title</Form.Label>
                            <Form.Control defaultValue={game.name} name="name" onChange={handleChange} size="lg" />
                        </Form.Group>
                        <p>by {game.creatorName}</p>
                        <hr></hr>
                        <Form.Group >
                            <Form.Label>Description</Form.Label>
                            <Form.Control defaultValue={game.description} name="description" onChange={handleChange} />
                        </Form.Group>
                        <Button type="submit">Save Changes</Button>
                    </Form>

                    <Button href = {designLink}>
                            Design Page
                    </Button>
                </div>

            )
        }
        else {
            return (
                <div className="game-page-container">
                    <Figure>
                        <Figure.Image className = 'layoutimg'
                            width={870}
                            height={524}
                            src="holder.js/870x524"
                        />
                    </Figure>
                    <h2>{game.name}</h2>
                    <p>by {game.creatorName}</p>
                    <hr></hr>
                    <p>{game.description}</p>
                    <p>Tags:</p>
                    <p>{game.tags}</p>
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

export default GamePage;
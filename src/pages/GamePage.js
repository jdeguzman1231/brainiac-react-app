import React from 'react';
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/client'
import { Form, Button, Modal, Figure, OverlayTrigger, Tooltip, Jumbotron, ButtonGroup } from 'react-bootstrap';
import { AuthContext } from "../context/auth";
import { useContext, useState, useEffect, useRef } from "react";
import { useForm } from '../util/hooks';
import { Link } from 'react-router-dom'
import { run as runHolder } from 'holderjs/holder'
import trashcan from '../images/trashcan.png'
import save from '../images/save.png'
import pencil from '../images/pencil.png'
import image from '../images/edit_picture.png'
import {EDIT_GAME} from '../graphql/mutations'
import {FETCH_GAME_QUERY} from '../graphql/queries'
import { transformOperation } from '@apollo/client/link/utils';
function GamePage(props) {
    useEffect(() => {
        runHolder('layoutimg')
    })
    const [namedesc, setValues] = useState({name: '', description: ''})
    const choosePic = useRef(null)
    const [show, setShow] = useState(false);
    const [gamepic, setgamepic] = useState('')
    const [all, setAll] = useState([])
    const[loadimg, setLoad] = useState(false)
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
    const playLink = gameID + "/start"
    const { handleChange, onSubmit, values } = useForm(editGame, {
        name: '',
        description: ''
    })
    const [updateGame] = useMutation(EDIT_GAME, {
        update(proxy, result) {
            window.location.reload();
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
        var newarray = []
        for(var i = 0; i < all.length; i++){
            newarray.push(all[i])
        }
        newarray[0] = gamepic
        console.log(values)
        if(values.name == ''){
            values.name = namedesc.name
        }
        if(values.description == ''){
            values.description = namedesc.description
        }
        updateGame({variables: {
            gameID: gameID,
            parentPlatform: parentPlatform,
            name: values.name,
            creatorName: creatorName,
            description: values.description,
            pictures: newarray
        }});
    }
    const btnclick = (e) => {
        choosePic.current.click()
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

    const setPhoto = async e =>{
        const newfile = new FormData()
        newfile.append('file', e.target.files[0])
        newfile.append('upload_preset', 'brainiac_img')
        setLoad(true)
        const res = await fetch('https://api.cloudinary.com/v1_1/dkgfsmwvg/image/upload/',
            {
                method: 'POST',
                body: newfile
            }
        )
        const picfile = await res.json()
        console.log(picfile.secure_url)
        setgamepic(picfile.secure_url);
        setLoad(false)
    }

    const color1 = pdata.getPlatform.color1
    const color2 = pdata.getPlatform.color2
    var background = 'radial-gradient(36.69% 153.15% at 50% 50%, ' + color1 + ' 0%, rgba(255, 255, 255, 0) 100%), ' + color2

    if (loading) { return "loading" }
    else if (load) {return "loading"}

        const game = data.getGame
        console.log(game.pictures[0])
        console.log(game.name)
        console.log(game.description)
        if(namedesc.name == '' && game){
            var tmp = {name: '', description: ''}
            tmp.name = game.name
            tmp.description = game.description
            setValues(tmp)
        }

        if(all.length != game.pictures.length){
            setAll(game.pictures)
            if (game.pictures.length> 0){
                setgamepic(game.pictures[0])
            }
        }
        if(gamepic == '' && game.pictures.length == 0){
            if(game.pictures.length == 0){
                setgamepic('holder.js/870x524')
            }
            else{
                setgamepic(game.pictures[0])
            }
        }
        if (user && user.username == game.creatorName) {
            console.log(gamepic)
            return (
                <div className="game-page-container">
                    <Jumbotron style={{ background: background }}><h1>{pdata.getPlatform.name}</h1>
                        <Link to={`/platform/${parentPlatform}`}>Back to platform</Link>
                    </Jumbotron>
                    <Form.File.Input style = {{display:'none'}} ref = {choosePic} onChange={setPhoto}></Form.File.Input>
                    {loadimg ? (
                        <h1>Loading.....</h1>
                    ) : (
                    <Button style={{ background: "#FFFF", borderColor: "#FFFF" }} href={playLink}>
                        <Figure class="game-screen" >

                            <Figure.Image 
                                width={870}
                                height={524}
                                src={gamepic}
                            />

                        </Figure> </Button>
                    )}
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
                            <OverlayTrigger placement = "bottom" overlay={<Tooltip>Edit game image</Tooltip>}>
                                <Button variant = 'light' onClick = {btnclick}>
                                <img width={30} height={30} src={image}></img>
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
                    <Jumbotron style={{ background: background }}><h1>{pdata.getPlatform.name}</h1>
                        <Link to={`/platform/${parentPlatform}`}>Back to platform</Link>
                    </Jumbotron>
                    <Button style={{ background: "#FFFF", borderColor: "#FFFF" }} href={playLink}>
                        <Figure class="game-screen" >

                            <Figure.Image 
                                width={870}
                                height={524}
                                src={gamepic}
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
            color1
            color2
        }
    }  
`;

export default GamePage;
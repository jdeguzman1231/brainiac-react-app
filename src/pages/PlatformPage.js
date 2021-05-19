
import { useQuery, useMutation } from '@apollo/client'
import { Container, Col, Row, Jumbotron, Button, Modal, Tooltip, OverlayTrigger, ButtonGroup, Form, Dropdown } from 'react-bootstrap'
import GameCard from '../components/GameCard'
import gql from 'graphql-tag';
import { AuthContext } from "../context/auth";
import { useContext, useState, useEffect } from "react";
import { useForm } from '../util/hooks';
import { Link } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import trashcan from '../images/trashcan.png'
import cog from '../images/cog.png'
import {FETCH_PLATFORM_QUERY, BOOKMARK_PLATFORM, UNBOOKMARK_PLATFORM, DELETE_PLATFORM} from '../graphql/queries'
function PlatformPage(props) {

    function refresh() {
        window.location.reload();
    }

    const [bookmarked, setBookmarked] = useState(false);
    const [show, setShow] = useState(false);
    const [colors, setColors] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const showColors = () => setColors(true);
    const hideColors = () => setColors(false);
    const { handleChange, onSubmit, values } = useForm(updateColorCallback, {
        platformID: '',
        color2: '',
        color1: ''
    }) 
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

    const { loading: loadingg, data: userData } = useQuery(FETCH_USER_QUERY, {
        variables: { username: creatorName }
    });

    var bookmarkedPlatforms = [];
    if (loadingg) {

    }
    else {
        if (userData.getUser != null) {
            bookmarkedPlatforms = JSON.parse(JSON.stringify(userData.getUser.bookmarkedPlatforms));
        }
    }

    const [bookmarkedPlats, setBookmarkedPlats] = useState(bookmarkedPlatforms);

    const { loading, data: pdata } = useQuery(FETCH_PLATFORM_QUERY, {
        variables: { platformID: platformID },
        fetchPolicy: 'cache-and-network'
    });

    const [updateColor, {loading: load}] = useMutation(EDIT_COLORS, {
        update(cache) {
            console.log(cache)
            window.location.reload();
        },
        onError(err) {
            console.log(err.networkError.result.errors);
        },
        variables: {
            color1: values.color1,
            color2: values.color2,
            platformID: platformID
        }
    })

    function updateColorCallback() {
        updateColor()
        setShow(false);
    }


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
        const tags = platform.tags
        var ptags = []
        console.log(tags.length)
        console.log(tags)
        for(var i = 0; i < tags.length; i++){
            if(i == tags.length -1){
                ptags.push(
                    <Link>{tags[i]}</Link>
                )
            }
            else{
                ptags.push(
                    <Link>{tags[i]}/</Link>
                )
            }
        }
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
            if (bookmarked) {
                bookmarkButton = <Button onClick={unbookmarkPlatform} variant='secondary' style={{ float: 'right'}}>
                    Unbookmark
                </Button>
            }
            else {
                bookmarkButton = <Button onClick={bookmarkPlatform} variant='secondary' style={{ float: 'right' }}>
                    Bookmark
                </Button>
            }
        }
        if (user && user.username == platform.creatorName) {
            const color1 = platform.color1
            const color2 = platform.color2
            var background = 'radial-gradient(36.69% 153.15% at 50% 50%, ' + color1 + ' 0%, rgba(255, 255, 255, 0) 100%), ' + color2
            return (
                <div className="page-container">
                    <Jumbotron style={{background: background}}>                         
                        <Row>
                            <Col>
                                <h1>{platform.name}</h1>
                                <br></br>
                                <p>{platform.description}</p>
                                <p>created by <Link to={`/account/${platform.creatorName}`}>{platform.creatorName}</Link></p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ButtonGroup>
                                    <OverlayTrigger
                                        placement="bottom"
                                        overlay={
                                            <Tooltip>
                                                Edit Settings
                                        </Tooltip>
                                        }>
                                        <Button variant="light" onClick={toSettings}><img width={30}
                                            height={30} src={cog}></img></Button>
                                    </OverlayTrigger>

                                    <OverlayTrigger
                                        placement="bottom"
                                        overlay={
                                            <Tooltip>
                                                Delete Platform
                                        </Tooltip>
                                        }>
                                        <Button variant="light" onClick={handleShow}><img width={30}
                                            height={30} src={trashcan}></img></Button>
                                    </OverlayTrigger>

                                </ButtonGroup>

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

                                <Modal show = {colors} onHide = {hideColors}>
                                    <Modal.Header>
                                        <Modal.Title>Add Activity</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        Select Two Colors
                                        <Dropdown>
                                            <Form onSubmit = {onSubmit}>
                                            <Form.Group>
                                                <Form.Control as="select" name = "color1" onChange={handleChange}>
                                                        <option>Choose Color 1</option>
                                                        <option value = "#f8c3b9">Red</option>
                                                        <option value = "#f6d3af">Orange</option>
                                                        <option value = "#fbeba5">Yellow</option>
                                                        <option value = "#b5efce">Green</option>
                                                        <option value = "#b7dcf4">Blue</option>
                                                        <option value = "#ddc6e7">Purple</option>
                                                        <option value = "#e8eaec">Gray</option>
                                                        <option value = "#ffd1dc">Pink</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Control as="select" name = "color2" onChange={handleChange}>
                                                        <option>Choose Color 2</option>
                                                        <option value = "#f8c3b9">Red</option>
                                                        <option value = "#f6d3af">Orange</option>
                                                        <option value = "#fbeba5">Yellow</option>
                                                        <option value = "#b5efce">Green</option>
                                                        <option value = "#b7dcf4">Blue</option>
                                                        <option value = "#ddc6e7">Purple</option>
                                                        <option value = "#e8eaec">Gray</option>
                                                        <option value = "#ffd1dc">Pink</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Button variant="primary" type="submit" block>
                                                    Change
                                            </Button>
                                            </Form>
                                        </Dropdown>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button onClick = {hideColors}> Cancel </Button>
                                    </Modal.Footer>
                                </Modal>

                                <Button style = {{float: "right"}} variant='secondary' onClick = {showColors}>Edit Colors</Button>
                                {bookmarkButton}

                            </Col>
                        </Row>
                        <Row>
                            <p>Tags:</p>
                        </Row>
                        <Row>
                            <p>{ptags}</p>
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
            const color1 = platform.color1
            const color2 = platform.color2
            var background = 'radial-gradient(36.69% 153.15% at 50% 50%, ' + color1 + ' 0%, rgba(255, 255, 255, 0) 100%), ' + color2
            return (
                <div className="page-container">
                    <Jumbotron style={{background: background}}> 
                        <h1>{platform.name}</h1>
                        <br></br>
                        <p>{platform.description}</p>
                        <p>created by <Link to={`/account/${platform.creatorName}`}>{platform.creatorName}</Link></p>

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

const EDIT_COLORS = gql`
    mutation editPlatformColors(
        $platformID: Int!
        $color1: String
        $color2: String
    ) {
        editPlatformColors(
            platformID: $platformID
            color1: $color1
            color2: $color2
        )
    }
`



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




export default PlatformPage;
import React, {useState} from 'react';
import ActivityCard from './../components/ActivityCard';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useForm } from '../util/hooks';
import {Container, Row, Col, Button, Modal, Dropdown, Form} from "react-bootstrap";

function DesignPage(props) {
    const [show, setShow] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const handleClose = () => setShow(false);
    const openModal = () => setShow(true);
    const ggameID = props.match.params.gameID;
    const gameID = parseInt(ggameID, 10);

    const { handleChange, onSubmit, values } = useForm(addActivityCallback, {
        type: '',
        gameID: gameID
    })

    const [addActivity, {loading: load}] = useMutation(ADD_ACTIVITY, {
        update(proxy, result) {
            console.log(result)
        },
        onError(err) {
            console.log(err)
        },
        variables: {
            type: values.type,
            gameID: gameID
        }
    })

    function addActivityCallback() {
        addActivity()
        setShow(false);
        window.location.reload();
    }

    const { loading, data } = useQuery(FETCH_GAME_QUERY, {
        variables: { gameID, gameID },
        fetchPolicy: 'cache-and-network'
    });

    if (loading) {
        return "loading..."
    }
    else{
        const game = data.getGame;
        return(
            <Container>
                <p>You are currently working on...</p>
                <h2>{game.name}</h2>
                <h4>Activities</h4>
                <Container>
                        <Row style = {{paddingBottom: '30px'}}>
                            {loading ? (<h1>Loading...</h1>) : (
                            game.activities && game.activities.map((activityID, key) => (
                                <Col style = {{paddingBottom: '20px'}}>
                                     <p>{key+1}</p>
                                    <ActivityCard activityID={activityID}/>
                                </Col>
                            ))
                        )}
                        </Row>
                        <Row>
                           <Button style = {{left: '50%'}} onClick = {openModal}>Add New Activity</Button>
                        </Row>
                </Container>
                <Modal show = {show} onHide = {handleClose}>
                    <Modal.Header>
                        <Modal.Title>Add Activity</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Select an Activity Type from below
                        <Dropdown>
                           <Form onSubmit = {onSubmit}>
                            <Form.Group>
                                <Form.Control as="select" onChange = {handleChange} name = "type">
                                        <option>Choose Type</option>
                                        <option value = "multiple">Multiple Choice</option>
                                        <option value = "Flashcards">Flashcards</option>
                                        <option value = "fill">Fill in the Blank</option>
                                        <option value = "matching">Matching</option>
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit" block>
                                    Add
                            </Button>
                           </Form>
                        </Dropdown>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick = {handleClose}> Cancel </Button>
                    </Modal.Footer>
                </Modal>
                
            </Container>
        )
    }
}

export default DesignPage;

const FETCH_GAME_QUERY = gql`
    query($gameID: Int!){
        getGame(gameID: $gameID){
            name
            creatorName
            description
            parentPlatform
            tags
            activities
        }
    }
`;

const ADD_ACTIVITY = gql`
    mutation addActivity(
        $type: String!
        $gameID: Int!
    ) {
        addActivity(
            type: $type
            gameID: $gameID
        ) {
            type
            data
        }
    }
`
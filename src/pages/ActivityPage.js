import React, { useState } from 'react';
import ActivityCard from './../components/ActivityCard';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Container, Row, Col, Button, Card, Modal, Form, Jumbotron, Link } from "react-bootstrap";
import { useForm } from '../util/hooks';
import QuestionCard from "./../components/QuestionCard";
import { getVariableValues } from 'graphql/execution/values';

function ActivityPage(props) {
    const [show, setShow] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showDeleteQ, setShowDeleteQ] = useState(false);
    const openDelete = () => setShowDelete(true);
    const handleCloseDelete = () => setShowDelete(false);
    const openDeleteQ = () => setShowDeleteQ(true);
    const handleCloseDeleteQ = () => setShowDeleteQ(false);
    const aactivityID = props.match.params.activityID;
    const ggameID = props.match.params.gameID;
    const pplatformID = props.match.params.parentPlatform;
    const handleClose = () => setShow(false);
    const openModal = () => setShow(true);
    const activityID = parseInt(aactivityID, 10);
    const gameID = parseInt(ggameID, 10);
    const platformID = parseInt(pplatformID, 10);
    const [index, setIndex] = useState(0);
    // var index;

    const { loading, data } = useQuery(FETCH_ACTIVITY_QUERY, {
        variables: { activityID: activityID },
    });
    const { handleChange, onSubmit, values } = useForm(addCardCallback, {
        email: '',
        password: ''
    })
    const [addCard, { loading: load }] = useMutation(ADD_CARD, {
        update(proxy, { data }) {
            console.log("new ", data.addActivityCard.card)
            try {
                const d = proxy.readQuery({ query: FETCH_ACTIVITY_QUERY, variables: { activityID: activityID }, });
                var array1 = [...d.getActivity.data]
                array1.push(data.addActivityCard.card)
                proxy.writeQuery({
                    query: FETCH_ACTIVITY_QUERY,
                    data: {
                        getActivity: {
                            activityID: activityID,
                            data: array1,
                            parentPlatform: platformID,
                            parentGame: gameID
                        },
                    },
                    variables: {
                        activityID: activityID,
                        parentPlatform: platformID,
                        parentGame: gameID
                    }
                })
            }
            catch (error) {
                console.error(error.networkError.result.errors)
            }
        },
        onError(err) {
            console.log(err.networkError.result.errors);
        },
        variables: {
            card1: values.question,
            card2: values.correct,
            card3: values.option1,
            card4: values.option2,
            card5: values.option3,
            card6: values.option4,
            activityID: activityID
        }
    })
    // delete activity
    const [deleteActivity] = useMutation(DELETE_ACTIVITY, {
        update(proxy, result) {
            console.log("Deleted activity")
            window.location.replace("/platform/" + platformID + "/game/" + gameID + "/design");
            const d = proxy.readQuery({ query: FETCH_GAME_QUERY, variables: { gameID: gameID }, });
            var array1 = [...d.getGame.activities]
            var ind;
            for (var i = 0; i < array1.length; i++) {
                if (array1[i] == activityID) {
                    ind = i
                }
            }
            array1.splice(ind, 1)
            console.log("here", d, array1)
            proxy.writeQuery({
                query: FETCH_GAME_QUERY,
                data: {
                    getGame: {
                        gameID: gameID,
                        activities: array1
                    },
                },
                variables: {
                    gameID: gameID
                }
            });
        },
        onError(err) {
            console.log("uh")
        },
        variables: {
            activityID: activityID,
            gameID: gameID
        }
    })

    // delete question
    const [deleteQuestion] = useMutation(DELETE_QUESTION, {
        update(proxy, result) {
            console.log("Deleted question")
            const d = proxy.readQuery({ query: FETCH_ACTIVITY_QUERY, variables: { activityID: activityID }, });
            var array1 = [...d.getActivity.data]
            var ind;
            for (var i = 0; i < array1.length; i++) {
                if (array1[i] == index) {
                    ind = i
                }
            }
            array1.splice(ind, 1)
            console.log("here", d, array1)
            proxy.writeQuery({
                query: FETCH_ACTIVITY_QUERY,
                data: {
                    getActivity: {
                        activityID: activityID,
                        data: array1
                    },
                },
                variables: {
                    activityID: activityID
                }
            });
        },
        onError(err) {
            console.log(err.networkError.result.errors);
        },
        variables: {
            activityID: activityID,
            index: index
        }
    })

    function delQuestion() {
        setShowDeleteQ(false)
        console.log("in del", index)
        deleteQuestion({ variables: { activityID: activityID, index: index } });
    }

    function addCardCallback() {
        addCard();
        setShow(false);
    }


    if (loading) return "loading"
    else {
        var title;
        var len;
        var modal;
        var start;
        const activity = data.getActivity
        const questions = activity.data
        if (activity.type === 'multiple') {
            // source = multiple
            title = "Multiple Choice"
            len = 6;
            start = 2;
            modal =
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="Question" type="text" name="question" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="Correct Answer" type="text" name="correct" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="Option 1" type="text" name="option1" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="Option 2" type="text" name="option2" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="Option 3 (Optional)" type="text" name="option3" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="Option 4 (Optional)" type="text" name="option4" />
                    </Form.Group>
                    <Button variant="primary" type="submit" block>
                        Add
                </Button>
                </Form>
        }
        else if (activity.type === 'fill') {
            // source = fill
            title = "Fill in the Blank"
            len = 4;
            start = 2;
            modal =
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="Question" type="text" name="question" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="Correct Answer" type="text" name="correct" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="In front of blank" type="text" name="option1" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="Behind blank" type="text" name="option2" />
                    </Form.Group>
                    <Button variant="primary" type="submit" block>
                        Add
                </Button>
                </Form>
        }
        else if (activity.type === 'Flashcards') {
            // source = fill
            title = "Flashcards"
            len = 1;
            start = 1;
            modal =
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="Front Side" type="text" name="question" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="Back Side" type="text" name="correct" />
                    </Form.Group>
                    <Button variant="primary" type="submit" block>
                        Add
                </Button>
                </Form>
        }
        else if (activity.type === 'matching') {
            title = "Matching"
            len = 1;
            start = 1;
            modal =
                <Form onSubmit={onSubmit}>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="First" type="text" name="question" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control onChange={handleChange} placeholder="Second" type="text" name="correct" />
                    </Form.Group>
                    <Button variant="primary" type="submit" block>
                        Add
                </Button>
                </Form>
        }
        return (
            <div>
                <Jumbotron>
                </Jumbotron>
                <Container style={{ paddingTop: '20px' }}>
                <Row>
                    <Col>
                        <h4>Activity Page</h4>
                        <p>Type: {title}</p>
                    </Col>
                    <Col>
                        <Row style={{ paddingTop: '10px', paddingLeft: '400px' }}>
                            <Button onClick={openDelete} variant="light">Delete This Activity</Button>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ paddingBottom: '10px' }}>
                    {questions.map((question, key) => (
                        <Card style={{ width: '22rem' }}>
                            <Card.Body>
                                <p>{key + 1}</p>
                                <Card.Title>{question[0]}</Card.Title>
                                <p>Correct Answer: {question[1]}</p>
                                {question.slice(start, len).map((quest) =>
                                    <p>{quest}</p>
                                )}
                                <Row>
                                    <Col>
                                        <Button onClick={() => {
                                            setIndex(key);
                                            openDeleteQ();
                                            console.log("key", key)
                                        }} style = {{float: "right"}}>Delete</Button>
                                    </Col>
                                </Row>
                                <Modal show={showDeleteQ} onHide={handleCloseDeleteQ}>
                                    <Modal.Header>
                                        <Modal.Title>Are you sure you want to delete this question?</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Row>
                                            <Col>
                                                <Button onClick={e => {
                                                    e.preventDefault();
                                                    delQuestion();
                                                }}>Yes</Button>
                                            </Col>
                                            <Col>
                                                <Button onClick={handleCloseDeleteQ}>No</Button>
                                            </Col>
                                        </Row>
                                    </Modal.Body>
                                </Modal>
                            </Card.Body>
                        </Card>
                    ))}
                </Row>
                <Row style = {{marginBottom: "50px"}}>
                    <Col>
                        <Button onClick={openModal}>Add a question</Button>
                    </Col>
                    <Col>
                        <Button onClick={openModal} style = {{float: "right"}} variant = "light">Back</Button>
                    </Col>
                </Row>
                <Modal show={showDelete} onHide={handleCloseDelete}>
                    <Modal.Header>
                        <Modal.Title>Are you sure you want to delete this activity?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <Button onClick={e => {
                                    e.preventDefault();
                                    deleteActivity({ variables: { activityID: activityID, gameID: gameID } });
                                }}>Yes</Button>
                            </Col>
                            <Col>
                                <Button onClick={handleCloseDelete}>No</Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Add question</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Input your {title} options below:
                        {modal}
                    </Modal.Body>
                </Modal>
            </Container>
            </div>
            
        )
    }
}

export default ActivityPage;

const FETCH_ACTIVITY_QUERY = gql`
    query($activityID: Int!){
        getActivity(activityID: $activityID){
            type
            data
            parentPlatform
            parentGame
        }
    }  
`;

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

const ADD_CARD = gql`
    mutation addActivityCard(
        $card1: String!
        $card2: String!
        $card3: String
        $card4: String
        $card5: String
        $card6: String
        $activityID: Int!
    ) {
        addActivityCard(
            card1: $card1
            card2: $card2
            card3: $card3
            card4: $card4
            card5: $card5
            card6: $card6
            activityID: $activityID
        )
    }
`

export const DELETE_ACTIVITY = gql`
    mutation removeActivity(
        $activityID: Int!
        $gameID: Int!
        ){
           removeActivity(
                activityID: $activityID
                gameID: $gameID
            )
        }
`;

export const DELETE_QUESTION = gql`
    mutation removeActivityCard(
        $activityID: Int!
        $index: Int!
        ){
           removeActivityCard(
                activityID: $activityID
                index: $index   
            )
        }
`;


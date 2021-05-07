import React, {useState} from 'react';
import ActivityCard from './../components/ActivityCard';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import {Container, Row, Col, Button, Card, Modal, Form} from "react-bootstrap";
import { useForm } from '../util/hooks';
import QuestionCard from "./../components/QuestionCard";
import { getVariableValues } from 'graphql/execution/values';

function ActivityPage(props) {
    const [show, setShow] = useState(false);
    const aactivityID = props.match.params.activityID;
    const handleClose = () => setShow(false);
    const openModal = () => setShow(true);
    const activityID = parseInt(aactivityID, 10);
    const { loading, data } = useQuery(FETCH_ACTIVITY_QUERY, {
        variables: { activityID: activityID },
    });
    const { handleChange, onSubmit, values } = useForm(addCardCallback, {
        email: '',
        password: ''
    })
    const [addCard, {loading:load}] = useMutation(ADD_CARD, {
        update(proxy, {data}) {
            console.log("new ", data.addActivityCard.card)
            try{
                const d = proxy.readQuery({query: FETCH_ACTIVITY_QUERY, variables: {activityID: activityID}, });
                var array1 = [...d.getActivity.data]
                array1.push(data.addActivityCard.card)
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
                })

            }
            catch(error) {
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
    function addCardCallback() {
        addCard();
        setShow(false);
    }
    console.log(activityID);
    if (loading) return "loading"
    else{
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
            <Form onSubmit = {onSubmit}>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "Question" type = "text" name = "question"/>
                </Form.Group>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "Correct Answer" type = "text" name = "correct"/>
                </Form.Group>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "Option 1" type = "text" name = "option1"/>
                </Form.Group>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "Option 2" type = "text" name = "option2"/>
                </Form.Group>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "Option 3 (Optional)" type = "text" name = "option3"/>
                </Form.Group>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "Option 4 (Optional)" type = "text" name = "option4"/>
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
            <Form onSubmit = {onSubmit}>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "Question" type = "text" name = "question"/>
                </Form.Group>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "Correct Answer" type = "text" name = "correct"/>
                </Form.Group>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "In front of blank" type = "text" name = "option1"/>
                </Form.Group>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "Behind blank" type = "text" name = "option2"/>
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
            <Form onSubmit = {onSubmit}>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "Front Side" type = "text" name = "question"/>
                </Form.Group>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "Back Side" type = "text" name = "correct"/>
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
            <Form onSubmit = {onSubmit}>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "First" type = "text" name = "question"/>
                </Form.Group>
                <Form.Group>
                    <Form.Control onChange = {handleChange} placeholder = "Second" type = "text" name = "correct"/>
                </Form.Group>
                <Button variant="primary" type="submit" block>
                        Add
                </Button>
           </Form>
        }
        return (
            <Container>
                Activity Page
                <p>Type: {title}</p>
                <Row style = {{paddingBottom: '10px'}}>
                        {questions.map((question, key) => (
                            <Card style = {{ width: '22rem' }}>
                            <Card.Body>
                                <p>{key+1}</p>
                                <Card.Title>{question[0]}</Card.Title>
                                <p>Correct Answer: {question[1]}</p>
                                {question.slice(start,len).map((quest) =>
                                    <p>{quest}</p>
                                )}
                                <Button>Edit</Button>
                            </Card.Body>
                            </Card>
                        ))}
                </Row>
                <Button onClick = {openModal}>Add a question</Button>
                <Modal show = {show} onHide = {handleClose}>
                    <Modal.Header>
                        <Modal.Title>Add question</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Input your {title} options below:
                        {modal}
                    </Modal.Body>
                </Modal>
            </Container>
        )
    }
}

export default ActivityPage;

const FETCH_ACTIVITY_QUERY = gql`
    query($activityID: Int!){
        getActivity(activityID: $activityID){
            type
            data
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

import React, {useState, useEffect, setState} from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client'
import PlatformCard from '../components/PlatformCard'
import { Container, Col, Row, Jumbotron, Form, Button, DropdownButton, Dropdown} from 'react-bootstrap'
import { stripIgnoredCharacters } from 'graphql';
import {FETCH_PLATFORMS_QUERY} from '../graphql/queries'
import {useForm} from '../util/hooks';
function ExplorePage() {
    const [form, setSearch] = useState({search: '', pvg: 0, category: 0})
    const [platforms, setPlatforms] = useState([]);
    console.log(useQuery(FETCH_PLATFORMS_QUERY));
    const { loading, data } = useQuery(FETCH_PLATFORMS_QUERY);
    useEffect(() =>{

        if(!loading && form.search == ''){
            setPlatforms(data.getPlatforms);
        }
    })
    const handleChange = (field, value) =>{

        setSearch({
            ...form,
            [field]: value
        })
    }

        function doSearch(){
            var key = form.search.toString().toLowerCase();
                var newPlatforms = platforms.filter(function(e){
                    var name = e.name.toLowerCase();
                    console.log(typeof name);
                    return name.includes(key);
                });
                setPlatforms(newPlatforms)
            
           
            console.log(newPlatforms)
            setPlatforms(newPlatforms)
            
        }
        return (
            <div class="page-container">
                <div class="explore">
                <Jumbotron style={{background: 'radial-gradient(36.69% 153.15% at 50% 50%, #FFFEEE 0%, rgba(255, 255, 255, 0) 100%), #D1E9E3'}}> 
                    <h1 class ="title" style = {{textAlign: 'center'}}>Explore Games</h1>
                </Jumbotron>
                <Form inline style = {{width: '100%', paddingInlineStart: '5%'}}className='mb-md-5 '>
                    <Form.Control onChange = {e => {handleChange('search', e.target.value)}} id = "search" style = {{width: '50%'}} type= 'text' placeholder ='Search' className ='mr-md-3'></Form.Control>
                    <Form.Label className ='mr-md-3'>By</Form.Label>
                    <Form.Control onChange = {e => handleChange('pvg', e.target.value)} id = "pvg" custom as="select" className ='mr-md-3' title = 'Game title' variant ='secondary'>
                        <option value = "0">Platform name</option>
                        <option value = "1">Game title</option>
                    </Form.Control>
                    <Form.Label className ='mr-md-3'>In</Form.Label>
                    <Form.Control onChange = {e => handleChange('category', e.target.value)} id = "category" custom as="select" className ='mr-md-3' title = 'Any Category' variant ='secondary'>
                        <option value = "0">History</option>
                        <option value = "1">Biology</option>
                        <option value = "2">Computer Science</option>
                        <option value = "3">Geography</option>
                    </Form.Control>
                    <Button variant = "secondary" onClick = {doSearch}>
                        Search
                    </Button>
                </Form>
                <Container>
                    <Row>{loading ? (<h1>Loading...</h1>) : (
                        platforms && platforms.map((platform) => (
                            <Col >
                                <PlatformCard platform={platform} />
                            </Col>
                        ))
                    )}
                    </Row>
                </Container>
                </div>
            </div>
        );
    
}



export default ExplorePage;


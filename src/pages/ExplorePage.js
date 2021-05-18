import React, {useState, useEffect, setState} from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client'
import PlatformCard from '../components/PlatformCard'
import { Container, Col, Row, Jumbotron, Form, Button, Pagination, Card} from 'react-bootstrap'
import { stripIgnoredCharacters } from 'graphql';
import {FETCH_PLATFORMS_QUERY, tagnames} from '../graphql/queries'
import {useForm} from '../util/hooks';
import {run as runHolder} from 'holderjs/holder'
function ExplorePage() {
    const [form, setSearch] = useState({search: '', pvg: 0, category: 0})
    const [page, setPage] = useState(8);
    const [platforms, setPlatforms] = useState([]);
    const pages = Math.ceil(platforms.length / 8);
    console.log(useQuery(FETCH_PLATFORMS_QUERY));
    const { loading, data } = useQuery(FETCH_PLATFORMS_QUERY);
    useEffect(() =>{
        if(!loading && form.search == ''){
            setPlatforms(data.getPlatforms);
        }
    })
    const handleChange = (field, value) =>{
        console.log(field)
        console.log(value)
        setSearch({
            ...form,
            [field]: value
        })
    }

    function doSearch(){
        console.log(platforms)
        console.log(form)
        var key = form.search.toString().toLowerCase();
        var tagfilter = parseInt(form.category)
        if(tagfilter == 0){
            var newPlatforms = platforms.filter(function(e){
                var name = e.name.toLowerCase();
                console.log(typeof name);
                return name.includes(key);
            });
            console.log(newPlatforms)
            setPlatforms(newPlatforms)
        }
        else{
            var index = tagfilter -1
            var tag = tagnames[index]
            var newPlatforms = platforms.filter(function(e){
                var tags = e.tags
                console.log(tags)
                var name = e.name.toLowerCase()
                console.log(name)
                return (tags) && (tags.includes(tag) && name.includes(key))
            })
            console.log(newPlatforms)
            setPlatforms(newPlatforms)
        }
        
    }
        
       const switchPage = (e) =>{
           e.preventDefault();
           console.log(e.target.id);
           console.log(pages);
            console.log(page);
           var id = e.target.id;
           switch (id) {
               case "first":
                   setPage(8);
                   break;
                case "last":
                    setPage(pages * 8);
                    break;
                case "prev":
                    setPage(page - 8);
                    break;
                case "next":
                    console.log(page);
                    setPage(page + 8);
                    break;
               default:
                   var newPage = parseInt(id);
                   setPage(newPage * 8);
                   break;
           }
           
       }
        var items = []
        for (var i = 1; i <= pages; i++){
            items.push(
                <Pagination.Item onClick = {switchPage} id = {i.toString()} key = {i} active = {(i * 8) == page}>
                    {i}
                </Pagination.Item>
            )
        }
        var tags = []
        for(var i = 0; i< tagnames.length; i++){
            tags.push(
                <option value = {(i+1).toString()}>{tagnames[i]}</option>
            )
        }
        console.log(platforms)
        return (
            <div>
                <div class="explore">
                <Jumbotron style={{background: 'radial-gradient(36.69% 153.15% at 50% 50%, #FFFEEE 0%, rgba(255, 255, 255, 0) 100%), #D1E9E3'}}> 
                    <h1 class ="title" style = {{textAlign: 'center'}}>Explore Games</h1>
                </Jumbotron>
                <Form inline style = {{justifyContent: 'center', width: '100%', paddingInlineStart: '5%'}}className='mb-md-5 '>
                    <Form.Control onChange = {e => {handleChange('search', e.target.value)}} id = "search" style = {{width: '50%'}} type= 'text' placeholder ='Search' className ='mr-md-3'></Form.Control>                   
                    <Form.Label className ='mr-md-3'>In</Form.Label>
                    <Form.Control onChange = {e => handleChange('category', e.target.value)} id = "category" custom as="select" className ='mr-md-3' title = 'Any Category' variant ='secondary'>
                        <option value = "0">All</option>
                        {tags}
                    </Form.Control>
                    <Button variant = "secondary" onClick = {doSearch}>
                        Search
                    </Button>
                </Form>
  
                <Container>
                    <Row>{loading ? (<h1>Loading...</h1>) : (
                        platforms && platforms.slice(page-8,page).map((platform) => (
                            <Col >
                                <PlatformCard platform={platform} />

                            </Col>
                        ))
                    )}
                    </Row>
                </Container>
                <Pagination style = {{marginBottom: '150px', marginTop: "50px", justifyContent: "center"}}>
                    <Pagination.First  id = "first" disabled = {page == 8} onClick = {switchPage}/>
                    <Pagination.Prev id = "prev" disabled = {page == 8} onClick = {switchPage}/>
                    {items}
                    <Pagination.Next  id = "next" disabled = {page == (pages * 8)} onClick = {switchPage}/>
                    <Pagination.Last id = "last" disabled = {page == (pages * 8)} onClick = {switchPage} />
                </Pagination>
      
                </div>
            </div>
        );
    
}



export default ExplorePage;


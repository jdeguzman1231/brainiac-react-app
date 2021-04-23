import { useQuery, useMutation } from '@apollo/client'
import { Container, Col, Row, Jumbotron, Button } from 'react-bootstrap'
import GameCard from '../components/GameCard'
import gql from 'graphql-tag';
import { AuthContext } from "../context/auth";
import { useContext, useForm } from "react";

function PlatformPage(props) {
    function refresh(){
        window.location.reload();
    }
     const { user, logout } = useContext(AuthContext);
    console.log(user)
    const pplatformID = props.match.params.platformID;
    var platformID = parseInt(pplatformID, 10);
    const platformURL = '/platform/' + pplatformID;                                          

    const { loading, data: pdata } = useQuery(FETCH_PLATFORM_QUERY, {
        variables: { platformID: platformID },
        fetchPolicy: 'cache-and-network'
    });

    
    const platform_settings = '/platform/' + pplatformID + '/settings';
    const toSettings = () =>{
        props.history.push()
    }
    const [bookmark] = useMutation(BOOKMARK_PLATFORM, {
        update(proxy, results) {
            props.history.push(platformURL)
        },
        onError(err) {
            console.log(err.networkError.result.errors);
        },
        variables: {
            username: user.username,
            platformID: platformID
        }
    })
    function bookmarkPlatform(){
        bookmark();
    }
    const creatorName = user.username;
    const parentPlatform = platformID;
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

   
    if (loading) { return "loading" }
    else {
        console.log(pdata)
        const platform = pdata.getPlatform
        console.log(platform_settings);

        if(user && user.username == platform.creatorName ){
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
                        <Button onClick = {toSettings} variant = 'secondary' style = {{marginLeft: '1000px', marginBottom: '10px'}}>
                        Settings
                        </Button>
                        <Button onClick = {bookmarkPlatform} variant = 'secondary' style = {{marginLeft: '1000px'}}>
                        Bookmark
                        </Button>
                        </Col>
                        </Row>
                </Jumbotron>
                    <h3>Games:</h3>
                    <Button onClick={e => {
                        e.preventDefault();
                        addGame({ variables: { creatorName: creatorName, parentPlatform: parentPlatform} });refresh();
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
        else{
            return (
                <div className="page-container">
                    <Jumbotron>
                        <h1>{platform.name}</h1>
                        <br></br>
                        <p>{platform.description}</p>
                        <p>created by {platform.creatorName}</p>
                        <Button onClick = {bookmarkPlatform} variant = 'secondary' style = {{marginLeft: '1000px'}}>
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

const CREATE_GAME= gql`
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


export default PlatformPage;
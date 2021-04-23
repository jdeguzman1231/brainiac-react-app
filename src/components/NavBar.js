import { useQuery } from "@apollo/client";
import React, { useContext, setState } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
  FormControl,
} from "react-bootstrap";
import { AuthContext } from "../context/auth";
import{FETCH_USERS_QUERY, FETCH_USER_QUERY} from '../graphql/queries';

function Menu() {
  const { user, logout } = useContext(AuthContext);
  const {loading, data} = useQuery(FETCH_USERS_QUERY,{
    fetchPolicy: 'no-cache'
    
  });
  console.log(user);

  let navBar;
  if (user && !loading) {
    const email = user.email;
    console.log(email)
    const users = data.getUsers
    console.log(users)
    var un = ''
    for(var i = 0; i< users.length; i++){
      if(users[i].email == email){
        console.log(users[i].email)
        un = users[i].username
        break;
      }
    }
    console.log(un)
    console.log(user.username)
    if(un){
      var link = "/account/" + un;
      var settingsLink = "/account/" + un + "/settings";
    }
   
    else{
      var username = user.username
      var link = "/account/" + username
      var settingsLink = "/account/" + username + "/settings"
    }
    console.log(link)
    console.log(settingsLink)
    navBar = (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Brainiac</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/explore">Explore</Nav.Link>
            <Nav.Link href={link}>Profile</Nav.Link>
            <Nav.Link href={settingsLink}>Settings</Nav.Link>
            <Nav.Link onClick={logout} href = "/">Log Out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  } else
    navBar = (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Brainiac</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/explore">Explore</Nav.Link>
            <Nav.Link href="/signup">Sign Up</Nav.Link>
            <Nav.Link href="/login">Log In</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  return navBar;
}

export default Menu;

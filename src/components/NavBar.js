import { useQuery } from "@apollo/client";
import React, { useContext, useState, setState, useRef, useEffect} from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
  FormControl,
} from "react-bootstrap";
import { AuthContext } from "../context/auth";
import { FETCH_USERS_QUERY, FETCH_USER_QUERY } from '../graphql/queries';

import icon from '../images/brainiac-icon.png';

function Menu() {
  const { user, logout } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_USERS_QUERY, {
    fetchPolicy: 'no-cache'

  });
  console.log(user);
  const [navBackground, setNavBackground] = useState(false)
    const navRef = useRef()
    navRef.current = navBackground
    useEffect(() => {
      const handleScroll = () => {
        const show = window.scrollY > 50
        if (navRef.current !== show) {
          setNavBackground(show)
        }
      }
      document.addEventListener('scroll', handleScroll)
      return () => {
        document.removeEventListener('scroll', handleScroll)
      }
    }, [])

  var currentPath = window.location.pathname;
  console.log("current", currentPath)

  let navBar;
  if (user && !loading) {
    const email = user.email;
    console.log(email)
    const users = data.getUsers
    console.log(users)
    var un = ''
    for (var i = 0; i < users.length; i++) {
      if (users[i].email == email) {
        console.log(users[i].email)
        un = users[i].username
        break;
      }
    }
    console.log(un)
    console.log(user.username)
    if (un) {
      var link = "/account/" + un;
      var settingsLink = "/account/" + un + "/settings";
    }

    else {
      var username = user.username
      var link = "/account/" + username
      var settingsLink = "/account/" + username + "/settings"
    }
    console.log(link)
    console.log(settingsLink)
    if(currentPath=="/"){
      navBar = (
        <Navbar expand="lg" fixed="top" style={{ transition: '.8s ease',backgroundColor: navBackground ? 'white' : 'transparent'}}>
        <Navbar.Brand href="/"> <img width={30}
          height={30} src={icon}></img></Navbar.Brand>
        <Navbar.Brand href="/">Brainiac</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" style={{fontFamily:"DM Sans"}}>
          <Nav className="mr-auto">
            <Nav.Link href="/explore">Explore</Nav.Link>
          </Nav>
          <Nav className="mr-sm-2" >
          <Nav.Link href={link}>Profile</Nav.Link>
            <Nav.Link href={settingsLink}>Settings</Nav.Link>
            <Nav.Link onClick={logout} href="/">Log Out</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      );

    }
    else{
      navBar = (
        <Navbar expand="lg">
          <Navbar.Brand href="/"> <img width={30}
            height={30} src={icon}></img></Navbar.Brand>
          <Navbar.Brand href="/">Brainiac</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" style={{fontFamily:"DM Sans"}}>
            <Nav className="mr-auto">
              <Nav.Link href="/explore">Explore</Nav.Link>
            </Nav>
            <Nav className="mr-sm-2" >
            <Nav.Link href={link}>Profile</Nav.Link>
              <Nav.Link href={settingsLink}>Settings</Nav.Link>
              <Nav.Link onClick={logout} href="/">Log Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      
      
    }

   
  } else{
    if(currentPath=="/"){
       navBar = (
      <Navbar expand="lg" fixed="top" style={{transition: '.8s ease',backgroundColor: navBackground ? 'white' : 'transparent'}}>
        <Navbar.Brand href="/"> <img width={30}
          height={30} src={icon}></img></Navbar.Brand>
        <Navbar.Brand href="/">Brainiac</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" style={{fontFamily:"DM Sans"}}>
          <Nav className="mr-auto">
            <Nav.Link href="/explore">Explore</Nav.Link>

          </Nav>
          <Nav className="mr-sm-2" >
            <Nav.Link href="/login">Log In</Nav.Link>
            <Nav.Link href="/signup">Sign Up</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );

    }
    else{
      navBar = (
        <Navbar expand="lg" >
          <Navbar.Brand href="/"> <img width={30}
            height={30} src={icon}></img></Navbar.Brand>
          <Navbar.Brand href="/">Brainiac</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" style={{fontFamily:"DM Sans"}}>
            <Nav className="mr-auto">
              <Nav.Link href="/explore">Explore</Nav.Link>
  
            </Nav>
            <Nav className="mr-sm-2" >
              <Nav.Link href="/login">Log In</Nav.Link>
              <Nav.Link href="/signup">Sign Up</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
      
    }
   

  }

  return navBar;
}

export default Menu;

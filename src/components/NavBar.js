import React, { useContext } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
  FormControl,
} from "react-bootstrap";
import { AuthContext } from "../context/auth";

function Menu() {
  const { user, logout } = useContext(AuthContext);
  console.log(user);
  let navBar;
  if (user) {
    const link = "/account/" + user.username;
    const settingsLink = "/account/" + user.username + "/settings";
    navBar = (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Brainiac</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/explore">Explore</Nav.Link>
            <Nav.Link href={link}>Profile</Nav.Link>
            <Nav.Link href={settingsLink}>Settings</Nav.Link>
            <Nav.Link href ="/createplatform">Create Platform</Nav.Link>
            <Nav.Link onClick={logout} href = '/'>Log Out</Nav.Link>
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

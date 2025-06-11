import React, { useState } from 'react';
import {
  Navbar, Nav, Container, Dropdown, Form, Button, Image
} from "react-bootstrap";
import {
  BsSearch, BsPersonPlus, BsSun, BsMoon, BsBook, BsPlusCircle, BsList, BsBoxArrowInRight
} from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import "./NavbarComponent.css";

const NavbarComponent = ({ theme, setTheme, user, setUser, onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/users/profile', {  // <-- CORRETTO QUI
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ themePreference: newTheme }),
      });

      if (!response.ok) {
        throw new Error('Errore durante il salvataggio del tema');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) onSearchChange(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const defaultAvatar = "https://res.cloudinary.com/tuo-cloud-name/image/upload/v1234567890/default-avatar.png";

  return (
    <Navbar
      expand="lg"
      className={`custom-navbar ${theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}
    >
      <Container fluid>
        {/* Menù laterale */}
        <Dropdown className="me-3">
          <Dropdown.Toggle as="div" className="btn custom-dropdown-toggle" role="button">
            <BsList />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={toggleTheme}>
              <span className="me-2">{theme === "dark" ? <BsMoon /> : <BsSun />}</span> Tema
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/my-library"><BsBook className="me-2" /> La mia libreria</Dropdown.Item>
            <Dropdown.Item as={Link} to="/aggiungi-gioco"><BsPlusCircle className="me-2" /> Aggiungi gioco</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* Barra di ricerca */}
        <div className="search-container">
          <Form className="d-flex search-form-custom" onSubmit={handleSubmit}>
            <Form.Control
              id="search-input"
              name="search"
              type="search"
              placeholder="Cerca un gioco..."
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              autoComplete="off"
            />
            <Button
              variant={theme === "dark" ? "outline-light" : "outline-dark"}
              className="form-search-btn"
              type="submit"
            >
              <BsSearch />
            </Button>
          </Form>
        </div>

        {/* Login/Register o Avatar */}
        <Nav className="ms-auto d-flex align-items-center">
          {user ? (
            <Nav.Link as={Link} to="/profile" className="p-0">
              <Image
                src={user.profile || defaultAvatar}
                roundedCircle
                width="40"
                height="40"
                alt="Profile"
                style={{ objectFit: "cover", cursor: "pointer" }}
              />
            </Nav.Link>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" className="btn custom-login-btn me-2 d-flex align-items-center">
                <BsBoxArrowInRight className="me-1" /> Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="btn custom-signin-btn d-flex align-items-center">
                <BsPersonPlus className="me-1" /> Sign In
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

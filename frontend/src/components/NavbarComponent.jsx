import React, { useState, useEffect, useRef } from 'react';
import {
  Navbar, Nav, Container, Dropdown, Form, Image
} from "react-bootstrap";
import {
  BsPersonPlus, BsSun, BsMoon, BsBook, BsPlusCircle, BsList
} from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import "./NavbarComponent.css";

const NavbarComponent = ({ theme, setTheme, user, setUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const debounceTimeout = useRef(null);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Salvataggio tema backend se serve
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      if (value.trim().length === 0) {
        setResults([]);
        setShowDropdown(false);
        return;
      }

      fetch(`/api/games/search?q=${encodeURIComponent(value.trim())}`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setShowDropdown(true);
        })
        .catch(() => {
          setResults([]);
          setShowDropdown(false);
        });
    }, 300);
  };

  const handleResultClick = (gameId) => {
    setSearchTerm('');
    setResults([]);
    setShowDropdown(false);
    navigate(`/games/${gameId}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.search-container')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const defaultAvatar = "https://res.cloudinary.com/tuo-cloud-name/image/upload/v1234567890/default-avatar.png";

  return (
    <Navbar
      expand="lg"
      className={`custom-navbar ${theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}
    >
      <Container fluid className="navbar-container d-flex align-items-center justify-content-between">
        {/* Dropdown a sinistra */}
        <Dropdown className="me-3 flex-shrink-0">
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

        {/* Barra di ricerca centrata assoluta */}
        <div className="search-container position-absolute">
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
          {showDropdown && results.length > 0 && (
            <div
              className="search-results-dropdown position-absolute"
              style={{ top: '100%', left: 0, right: 0 }}
            >
              {results.map(game => (
                <div
                  key={game._id}
                  className="search-result-item"
                  onClick={() => handleResultClick(game._id)}
                >
                  {game.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar a destra */}
        <Nav className="ms-auto d-flex align-items-center flex-shrink-0">
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
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="btn custom-signin-btn d-flex align-items-center">
                Sign In
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

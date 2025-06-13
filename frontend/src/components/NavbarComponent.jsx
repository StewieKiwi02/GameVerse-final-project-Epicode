import React, { useEffect, useRef } from 'react';
import {
  Navbar, Nav, Container, Dropdown, Form, Image, Button
} from "react-bootstrap";
import {
  BsSun, BsMoon, BsBook, BsPlusCircle, BsList, BsBoxArrowInRight, BsPersonPlus
} from "react-icons/bs";
import { Link, useNavigate } from 'react-router-dom';
import "./NavbarComponent.css";

const NavbarComponent = ({ theme, setTheme, user, setUser, searchTerm, setSearchTerm }) => {
  const [results, setResults] = React.useState([]);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const navigate = useNavigate();
  const debounceTimeout = useRef(null);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Aggiorna nel backend solo se l'utente è loggato
    if (user) {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token mancante");

        const res = await fetch("/api/users/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ themePreference: newTheme }),
        });

        if (!res.ok) throw new Error("Errore aggiornamento tema");
      } catch (err) {
        console.error("Errore salvataggio tema nel DB:", err.message);
      }
    }
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
          setResults(Array.isArray(data) ? data : []);
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

  return (
    <Navbar
      expand="lg"
      className={`custom-navbar ${theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}
    >
      <Container fluid className="navbar-container d-flex align-items-center justify-content-between flex-nowrap">
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

        {/* Barra di ricerca centrata */}
        <div className="search-container flex-grow-1 d-flex justify-content-center position-relative">
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
            <div className="search-results-dropdown">
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
        <Nav className="d-flex align-items-center flex-shrink-0">
          {user ? (
            <Nav.Link as={Link} to="/profile" className="p-0">
              <Image
                src={
                  user.profilePic
                    ? user.profilePic
                    : "/assets/profile/Nothing Profile.jpg"
                }
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
